import { ScrollViewStyleReset } from 'expo-router/html';
export default function DocumentoHtml({
  children: filhos
}) {
  return <html lang="pt-BR" translate="no" className="notranslate">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Language" content="pt-BR" />
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Controle suas receitas, despesas e metas com o Nexus Finance." />
        <ScrollViewStyleReset />
      </head>
      <body>{filhos}</body>
    </html>;
}
