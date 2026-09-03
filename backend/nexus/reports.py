import csv
from io import BytesIO, StringIO
from xml.sax.saxutils import escape

from openpyxl import Workbook
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

HEADERS = ["Data", "Descrição", "Tipo", "Categoria", "Conta", "Status", "Valor (BRL)"]


def safe_cell(value):
    text = str(value)
    return "'" + text if text.lstrip().startswith(("=", "+", "-", "@", "\t", "\r")) else text


def export(entries, fmt):
    rows = [
        [
            x["data_transacao"].isoformat(),
            x["descricao"],
            x["tipo"],
            x["categoria"],
            x["conta"],
            x["status"],
            str(x["valor"]),
        ]
        for x in entries
    ]
    if fmt == "csv":
        out = StringIO()
        writer = csv.writer(out, delimiter=";")
        writer.writerow(HEADERS)
        writer.writerows([[safe_cell(v) for v in r] for r in rows])
        return out.getvalue().encode("utf-8-sig"), "text/csv; charset=utf-8"
    out = BytesIO()
    if fmt == "xlsx":
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "Transações"
        for r in [HEADERS] + rows:
            sheet.append(r)
            for cell in sheet[sheet.max_row]:
                cell.data_type = "s"
        sheet.freeze_panes = "A2"
        sheet.auto_filter.ref = sheet.dimensions
        for key, width in zip("ABCDEFG", [14, 45, 16, 22, 22, 16, 18], strict=True):
            sheet.column_dimensions[key].width = width
        workbook.save(out)
        return out.getvalue(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    styles = getSampleStyleSheet()
    small = styles["BodyText"]
    small.fontSize = 8
    small.leading = 10
    data = [[Paragraph(escape(str(v)), small) for v in r] for r in [HEADERS] + rows]
    table = Table(data, repeatRows=1, colWidths=[65, 180, 65, 100, 100, 70, 90])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eeeeee")),
                ("GRID", (0, 0), (-1, -1), 0.3, colors.grey),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    SimpleDocTemplate(out, pagesize=landscape(A4), leftMargin=28, rightMargin=28).build(
        [Paragraph("NexusFinance — Relatório de transações", styles["Title"]), Spacer(1, 12), table]
    )
    return out.getvalue(), "application/pdf"
