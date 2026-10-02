import { StyleSheet } from 'react-native';
import { useTema } from "../contextos/ContextoTema";
function criarEstilosApp(cores) {
  const gradientes = {
    brand: ['#6C5CE7', '#5145FF', '#1809e0'],
    brandSoft: [cores.primariaSuave, cores.superficieAlternativa],
    success: ['#2ED573', '#17A863'],
    danger: ['#FF6B6B', '#E23E3E'],
    navBar: [cores.superficieAlternativa, cores.fundoAlternativo],
    fab: ['#7C6CFF', '#4800FF'],
    header: [cores.superficieAlternativa, cores.fundo]
  };
  const raios = {
    sm: 10,
    md: 16,
    lg: 24,
    xl: 28,
    pill: 999
  };
  const sombra = {
    soft: {
      shadowColor: cores.sombra,
      shadowOffset: {
        width: 0,
        height: 6
      },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6
    },
    glowPrimary: {
      shadowColor: cores.sombra,
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.55,
      shadowRadius: 14,
      elevation: 10
    }
  };

  // barraNavegacao
  const estilosBarraNavegacao = StyleSheet.create({
    // Menu expandido e navegação
    botaoFlutuantePressionavel: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    botaoFlutuante: {
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -30,
      backgroundColor: cores.primaria,
      borderWidth: 4,
      borderColor: cores.fundoAlternativo,
      ...sombra.soft
    },
    abaPressionavel: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 58
    },
    abaAnimadoConteudo: {
      alignItems: 'center'
    },
    abaCapsula: {
      paddingHorizontal: 14,
      paddingVertical: 4,
      borderRadius: raios.pill
    },
    abaTexto: {
      fontSize: 10,
      marginTop: 3,
      textAlign: 'center'
    },
    ativoPonto: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: cores.primaria,
      marginTop: 3
    },
    expandidoMenu: {
      position: 'absolute',
      bottom: 92,
      width: '94%',
      maxWidth: 420,
      alignSelf: 'center',
      paddingHorizontal: 8,
      backgroundColor: cores.superficieAlternativa,
      borderRadius: raios.lg,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      zIndex: 9,
      borderWidth: 1,
      borderColor: cores.borda,
      ...sombra.soft
    },
    expandidoMenuItem: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '22%',
      paddingVertical: 10,
      marginVertical: 4,
      borderRadius: raios.md
    },
    expandidoMenuIcone: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: cores.primariaSuave,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6
    },
    expandidoMenuRotulo: {
      color: cores.textoPrincipal,
      fontSize: 11,
      fontWeight: '600',
      textAlign: 'center'
    },
    atualSobreposicao: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: cores.sobreposicao,
      zIndex: 8
    },
    atualAbaBarra: {
      position: 'absolute',
      bottom: 8,
      alignSelf: 'center',
      width: '94%',
      maxWidth: 420,
      zIndex: 10,
      flexDirection: 'row',
      minHeight: 76,
      paddingVertical: 6,
      borderRadius: raios.xl,
      borderWidth: 1,
      borderColor: cores.borda,
      paddingHorizontal: 6,
      alignItems: 'center',
      backgroundColor: cores.fundoAlternativo,
      ...sombra.soft
    }
  });

  // boasVindas
  const estilosBoasVindas = StyleSheet.create({
    tela: {
      flex: 1,
      backgroundColor: cores.fundo,
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 24
    },
    ilustracao: {
      alignSelf: 'center',
      width: 200,
      height: 180,
      marginBottom: 60
    },
    cartao: {
      width: '100%',
      backgroundColor: cores.superficieSuave,
      borderRadius: 20,
      alignItems: 'center'
    },
    titulo: {
      color: cores.textoPrincipal,
      fontSize: 22,
      fontWeight: '600',
      marginTop: 10,
      textAlign: 'center'
    },
    subtitulo: {
      color: cores.textoSecundario,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 20,
      paddingLeft: 20,
      paddingRight: 20
    },
    botao: {
      width: '100%',
      minHeight: 48,
      backgroundColor: cores.primaria,
      borderRadius: 10,
      paddingLeft: 24,
      paddingBottom: 20,
      paddingTop: 20,
      paddingRight: 24,
      marginTop: 20,
      alignItems: 'center'
    },
    textoBotao: {
      color: cores.sobrePrimaria,
      fontSize: 15,
      fontWeight: 'bold'
    },
    link: {
      color: cores.textoSecundario,
      fontSize: 14,
      marginTop: 10,
      marginBottom: 15,
      textAlign: 'center'
    }
  });

  // cadastro
  const estilosCadastro = StyleSheet.create({
    recipiente: {
      flex: 1,
      marginTop: "20%",
      backgroundColor: cores.fundo,
      justifyContent: 'center',
      paddingHorizontal: 24
    },
    campo: {
      width: '100%',
      minHeight: 52,
      backgroundColor: cores.superficie,
      color: cores.textoPrincipal,
      fontSize: 16,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginBottom: 18
    },
    botao: {
      backgroundColor: cores.primaria,
      borderRadius: 10,
      padding: 14,
      marginTop: 20,
      alignItems: 'center'
    },
    botaoTexto: {
      color: cores.sobrePrimaria,
      fontSize: 15,
      fontWeight: 'bold'
    },
    erro: {
      color: cores.perigo,
      fontSize: 13,
      marginTop: 4
    }
  });

  // centralAjuda
  const estilosCentralAjuda = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    cartao: {
      backgroundColor: cores.superficieAlternativa,
      marginHorizontal: 18,
      marginTop: 20,
      marginBottom: 20,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: cores.borda,
      paddingVertical: 12,
      overflow: 'hidden'
    },
    cartaoTitulo: {
      color: cores.textoPrincipal,
      fontSize: 20,
      fontWeight: 'bold',
      marginHorizontal: 18,
      marginTop: 18,
      marginBottom: 12
    },
    itemMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingVertical: 18
    },
    itemEsquerda: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemTexto: {
      color: cores.textoPrincipal,
      fontSize: 16,
      marginLeft: 15,
      flexShrink: 1
    },
    divisor: {
      height: 1,
      backgroundColor: cores.divisor,
      marginHorizontal: 18
    },
    cartaoInformacoes: {
      backgroundColor: cores.superficie,
      marginHorizontal: 18,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: cores.borda,
      padding: 18,
      marginBottom: 20
    },
    cartaoInformacoesTitulo: {
      color: cores.textoPrincipal,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10
    },
    cartaoInformacoesTexto: {
      color: cores.textoSecundario,
      fontSize: 15,
      lineHeight: 22
    },
    contatoBotao: {
      backgroundColor: cores.primaria,
      marginHorizontal: 18,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    contatoTexto: {
      color: cores.sobrePrimaria,
      fontSize: 17,
      fontWeight: 'bold',
      marginLeft: 10
    }
  });

  // configuracoes
  const estilosConfiguracoes = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    cartao: {
      backgroundColor: cores.superficie,
      marginHorizontal: 18,
      marginTop: 18,
      borderRadius: 22,
      borderWidth: 2,
      borderColor: cores.borda,
      paddingVertical: 5,
      overflow: 'hidden'
    },
    cartaoTitulo: {
      color: cores.textoPrincipal,
      fontSize: 20,
      fontWeight: 'bold',
      marginHorizontal: 18,
      marginTop: 18,
      marginBottom: 12
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingVertical: 18
    },
    itemEsquerda: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemTexto: {
      flexShrink: 1,
      color: cores.textoPrincipal,
      fontSize: 17,
      marginLeft: 15,
      fontWeight: '500'
    },
    divisor: {
      height: 1,
      backgroundColor: cores.divisor
    }
  });

  // criarSenha
  const estilosCriarSenha = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      justifyContent: 'center',
      paddingHorizontal: 24
    },
    conteudo: {
      width: '100%',
      alignItems: 'center'
    },
    rotulo: {
      width: '100%',
      color: cores.textoPrincipal,
      fontSize: 15,
      marginTop: 11,
      fontWeight: '600'
    },
    campo: {
      width: '100%',
      minHeight: 55,
      backgroundColor: cores.superficie,
      borderRadius: 12,
      paddingHorizontal: 15,
      fontSize: 16,
      color: cores.textoPrincipal,
      marginTop: 15
    },
    botao: {
      width: '100%',
      height: 45,
      backgroundColor: cores.primaria,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
    botaoTexto: {
      color: cores.sobrePrimaria,
      fontSize: 15,
      fontWeight: 'bold'
    },
    erro: {
      color: cores.perigo,
      fontSize: 13,
      marginTop: 8
    }
  });

  // dashboard
  const estilosPainel = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    // ---------- PIE CHART ----------

    // ---------- LINHA ----------

    // ---------- RESUMO ----------

    // ---------- GERAL ----------

  });

  // fluxoFinanceiro
  const estilosFluxoFinanceiro = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    filtroRecipiente: {
      flexDirection: 'row',
      backgroundColor: cores.superficie,
      borderRadius: 30,
      padding: 3,
      marginTop: 10,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: cores.borda
    },
    botaoFiltro: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 25,
      alignItems: 'center'
    },
    botaoAtivo: {
      backgroundColor: cores.primaria
    },
    textoFiltro: {
      color: cores.textoPrincipal,
      fontSize: 14
    },
    textoAtivo: {
      color: cores.sobrePrimaria,
      fontWeight: 'bold'
    },
    dados: {
      marginTop: 20,
      backgroundColor: cores.superficie,
      borderRadius: 18,
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 20
    },
    dadosTitulo: {
      color: cores.textoPrincipal,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 16
    },
    dadosTexto: {
      color: cores.textoSecundario,
      fontSize: 14,
      marginTop: 12
    },
    transacaoItem: {
      flexWrap: 'wrap',
      gap: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda
    },
    transacaoDescricao: {
      color: cores.textoPrincipal,
      fontSize: 16,
      fontWeight: '600'
    },
    transacaoCategoria: {
      color: cores.textoSecundario,
      fontSize: 12,
      marginTop: 4
    },
    transacaoDireita: {
      flexGrow: 1,
      flexShrink: 1,
      alignItems: 'flex-end'
    },
    transacaoValor: {
      fontSize: 16,
      fontWeight: '700'
    },
    receita: {
      color: cores.sucesso
    },
    despesa: {
      color: cores.perigo
    },
    transacaoData: {
      color: cores.textoSecundario,
      fontSize: 12,
      marginTop: 4
    }
  });

  // inicio
  const estilosInicio = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo
    },
    // Cabeçalho com gradiente
    cabecalho: {
      paddingTop: 18,
      paddingBottom: 26,
      paddingHorizontal: 16,
      borderBottomLeftRadius: raios.xl,
      borderBottomRightRadius: raios.xl
    },
    perfilContaine: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      marginRight: 12,
      minWidth: 0
    },
    perfilCirculo: {
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 2.5,
      borderColor: cores.primaria,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: cores.superficieAlternativa
    },
    perfilInformacoes: {
      marginLeft: 16,
      flexShrink: 1,
      minWidth: 0
    },
    saudacaoRotulo: {
      color: cores.textoSuave,
      fontSize: 13,
      fontWeight: '500'
    },
    nome: {
      color: cores.textoPrincipal,
      fontSize: 21,
      fontWeight: 'bold',
      marginTop: 1
    },
    sinoBotao: {
      width: 44,
      height: 44,
      flexShrink: 0,
      borderRadius: 22,
      backgroundColor: cores.superficieAlternativa,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: cores.borda
    },
    // Saldo
    saldoRecipiente: {
      marginTop: 20,
      padding: 20,
      borderRadius: raios.xl,
      minHeight: 140,
      ...sombra.glowPrimary
    },
    saldoSuperiorLinha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    tituloSaldo: {
      fontSize: 15,
      fontWeight: '600',
      color: cores.sobrePrimaria
    },
    valor: {
      marginTop: 10,
      fontSize: 36,
      fontWeight: 'bold',
      color: cores.sobrePrimaria
    },
    saldoRodapeLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 14
    },
    saldoRodapeTexto: {
      flexShrink: 1,
      color: cores.sobrePrimaria,
      fontSize: 12,
      marginLeft: 6
    },
    // Conteúdo
    conteudo: {
      paddingHorizontal: 16
    },
    titulo: {
      fontSize: 25,
      marginTop: -10,
      fontWeight: '700',
      color: cores.textoPrincipal
    },
    cartao: {
      backgroundColor: cores.superficie,
      padding: 16,
      borderRadius: raios.lg,
      marginRight: 12,
      width: 160,
      minHeight: 150,
      borderWidth: 1,
      borderColor: cores.borda,
      justifyContent: 'flex-start'
    },
    cartaoIconeSelo: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10
    },
    cartaoTitulo: {
      fontSize: 15.1,
      fontWeight: '600',
      color: cores.textoSecundario
    },
    cartaoValor: {
      marginTop: 4,
      fontSize: 18,
      fontWeight: 'bold',
      color: cores.textoPrincipal
    },
    cartaoComparacao: {
      fontSize: 11,
      marginTop: 4,
      fontWeight: '600'
    },
    // Metas
    secaoCartao: {
      backgroundColor: cores.superficie,
      padding: 18,
      borderRadius: raios.lg,
      marginTop: 18,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: cores.borda
    },
    metaCabecalhoLinha: {
      flexWrap: 'wrap',
      gap: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
    },
    metaCabecalhoTitulo: {
      color: cores.textoPrincipal,
      fontSize: 17,
      fontWeight: '700'
    },
    graficos: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 18
    },
    metaInformacoesColuna: {
      flexDirection: 'column',
      marginLeft: 18,
      flex: 1
    },
    metaTituloTexto: {
      color: cores.textoPrincipal,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10
    },
    metaBarraFundo: {
      width: '100%',
      height: 7,
      backgroundColor: cores.superficieElevada,
      borderRadius: 10,
      overflow: 'hidden'
    },
    metaBarraPreenchida: {
      height: 7,
      backgroundColor: cores.primaria,
      borderRadius: 10
    },
    metaValoresTexto: {
      color: cores.textoSuave,
      fontSize: 13,
      marginTop: 8
    },
    // Distribuição de renda
  });

  // layout
  

  // login
  const estilosLogin = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      justifyContent: 'center',
      paddingHorizontal: 24
    },
    rotulo: {
      color: cores.textoSecundario,
      fontSize: 14,
      marginTop: 12,
      marginBottom: 4
    },
    campo: {
      backgroundColor: cores.superficie,
      borderRadius: 10,
      padding: 12,
      color: cores.textoPrincipal,
      fontSize: 15
    },
    botao: {
      backgroundColor: cores.primaria,
      borderRadius: 10,
      padding: 14,
      marginTop: 20,
      alignItems: 'center'
    },
    textoBotao: {
      color: cores.sobrePrimaria,
      fontSize: 15,
      fontWeight: 'bold'
    },
    link: {
      color: cores.textoSecundario,
      fontSize: 14,
      marginTop: 16,
      textAlign: 'center'
    },
    link2: {
      color: cores.textoLink,
      fontSize: 12,
      marginTop: 16,
      textAlign: 'left'
    },
    erro: {
      color: cores.perigo,
      fontSize: 13,
      marginTop: 8
    }
  });

  // metas
  const estilosMetas = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    cartao: {
      backgroundColor: cores.superficieSuave,
      borderRadius: 20,
      padding: 18,
      marginHorizontal: '5%',
      marginBottom: 18
    },
    cartaoCabecalho: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15
    },
    cartaoConcluida: {
      borderWidth: 1,
      borderColor: cores.sucesso
    },
    acoesCartao: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    },
    botaoAcao: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: cores.superficieElevada,
      justifyContent: 'center',
      alignItems: 'center'
    },
    nomeMeta: {
      color: cores.textoPrincipal,
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 12,
      flex: 1
    },
    progressoFundo: {
      width: '100%',
      height: 10,
      backgroundColor: cores.superficieElevada,
      borderRadius: 50,
      overflow: 'hidden'
    },
    progressoFill: {
      height: '100%',
      backgroundColor: cores.primaria,
      borderRadius: 50
    },
    progressoFillConcluida: {
      backgroundColor: cores.sucesso
    },
    concluidaSelo: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: cores.superficieElevada,
      marginBottom: 12
    },
    concluidaTexto: {
      color: cores.sucesso,
      fontSize: 14,
      fontWeight: 'bold'
    },
    informacoesLinha: {
      flexWrap: 'wrap',
      gap: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12
    },
    valor: {
      color: cores.textoSecundario,
      fontSize: 15
    },
    statusMeta: {
      color: cores.textoSecundario,
      fontSize: 14,
      marginTop: 8
    },
    statusConcluida: {
      color: cores.sucesso,
      fontWeight: 'bold'
    },
    porcentagem: {
      color: cores.textoLink,
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 12,
      textAlign: 'right'
    },
    porcentagemConcluida: {
      color: cores.sucesso
    },
    botaoAdicionar: {
      position: 'absolute',
      bottom: 95,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.primaria,
      paddingHorizontal: 25,
      height: 55,
      borderRadius: 30,
      elevation: 10
    },
    botaoTexto: {
      color: cores.sobrePrimaria,
      fontSize: 17,
      fontWeight: 'bold',
      marginLeft: 8
    },
    modalFundo: {
      flexGrow: 1,
      backgroundColor: cores.sobreposicao,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 25
    },
    modal: {
      maxWidth: 520,
      width: '100%',
      backgroundColor: cores.superficieSuave,
      borderRadius: 25,
      padding: 22
    },
    modalFundoExcluir: {
      flex: 1,
      backgroundColor: cores.sobreposicao,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 25
    },
    modalExcluir: {
      maxWidth: 460,
      width: '100%',
      backgroundColor: cores.superficieSuave,
      borderRadius: 25,
      padding: 22,
      alignItems: 'center'
    },
    iconeExcluir: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: cores.superficieElevada,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12
    },
    textoConfirmacao: {
      color: cores.textoSecundario,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
      marginBottom: 8
    },
    modalTitulo: {
      color: cores.textoPrincipal,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center'
    },
    campo: {
      width: '100%',
      minHeight: 55,
      backgroundColor: cores.campo,
      borderRadius: 14,
      paddingHorizontal: 15,
      color: cores.textoPrincipal,
      fontSize: 16,
      marginBottom: 15
    },
    modalBotoes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10
    },
    cancelar: {
      width: '47%',
      minHeight: 50,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: cores.primaria,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center'
    },
    cancelarTexto: {
      color: cores.textoPrincipal,
      fontWeight: 'bold',
      fontSize: 16
    },
    salvar: {
      width: '47%',
      minHeight: 50,
      paddingVertical: 12,
      paddingHorizontal: 8,
      backgroundColor: cores.primaria,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center'
    },
    salvarTexto: {
      color: cores.sobrePrimaria,
      fontWeight: 'bold',
      fontSize: 16
    },
    excluir: {
      width: '47%',
      minHeight: 50,
      paddingVertical: 12,
      paddingHorizontal: 8,
      backgroundColor: cores.perigo,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center'
    },
    excluirTexto: {
      color: cores.sobrePrimaria,
      fontWeight: 'bold',
      fontSize: 16
    }
  });

  // meuCadastro
  const estilosMeuCadastro = StyleSheet.create({
    salvarBotaoDesabilitado: {
      opacity: 0.6
    },
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    cartao: {
      marginTop: 20,
      backgroundColor: cores.superficie,
      marginHorizontal: 18,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: cores.borda,
      padding: 18
    },
    perfilLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20
    },
    perfilCirculo: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 2,
      borderColor: cores.primaria,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      backgroundColor: cores.superficieAlternativa
    },
    perfilInformacoes: {
      flex: 1
    },
    perfilNome: {
      color: cores.textoPrincipal,
      fontSize: 20,
      fontWeight: 'bold'
    },
    perfilEmail: {
      color: cores.textoSecundario,
      fontSize: 14,
      marginTop: 4
    },
    perfilSubtitulo: {
      color: cores.textoSecundario,
      fontSize: 14,
      lineHeight: 20
    },
    cartaoTitulo: {
      color: cores.textoPrincipal,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 18
    },
    campo: {
      width: '100%',
      minHeight: 55,
      backgroundColor: cores.campo,
      color: cores.textoPrincipal,
      fontSize: 16,
      borderRadius: 14,
      paddingHorizontal: 16,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: cores.borda
    },
    itemBotao: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
      backgroundColor: cores.campo,
      borderRadius: 14
    },
    itemEsquerda: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemTexto: {
      flexShrink: 1,
      color: cores.textoPrincipal,
      fontSize: 16,
      marginLeft: 14
    },
    salvarBotao: {
      backgroundColor: cores.primaria,
      padding: 14,
      marginHorizontal: 18,
      marginTop: 10,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center'
    },
    salvarBotaoTexto: {
      color: cores.sobrePrimaria,
      fontSize: 15,
      fontWeight: 'bold'
    }
  });

  // notificacoes
  const estilosNotificacoes = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    secundarioTitulo: {
      color: cores.textoSecundario,
      fontSize: 16,
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 15
    },
    cartao: {
      backgroundColor: cores.superficie,
      marginHorizontal: 18,
      marginBottom: 15,
      borderRadius: 20,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: cores.borda
    },
    cartaoNova: {
      borderLeftWidth: 5,
      borderLeftColor: cores.primaria
    },
    iconeRecipiente: {
      width: 55,
      height: 55,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15
    },
    textoRecipiente: {
      flex: 1
    },
    linha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cartaoTitulo: {
      color: cores.textoPrincipal,
      fontSize: 17,
      fontWeight: 'bold',
      flex: 1
    },
    descricao: {
      color: cores.textoSecundario,
      fontSize: 14,
      marginTop: 6,
      lineHeight: 20
    },
    hora: {
      color: cores.textoSecundario,
      fontSize: 13,
      marginLeft: 10
    },
    bolinha: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: cores.primaria,
      marginLeft: 10,
      alignSelf: 'flex-start',
      marginTop: 8
    },
    vazioRecipiente: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
      marginTop: 80
    },
    vazioTitulo: {
      color: cores.textoPrincipal,
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 20
    },
    vazioTexto: {
      color: cores.textoSecundario,
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 22
    }
  });

  // novaDespesa
  const estilosNovaDespesa = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    titulo: {
      flexShrink: 1,
      color: cores.textoPrincipal,
      marginLeft: 10,
      fontSize: 19,
      fontWeight: '600'
    },
    adicionarValor: {
      flexWrap: 'wrap',
      gap: 12,
      flexDirection: 'row',
      backgroundColor: cores.superficieSuave,
      padding: 12,
      margin: 16,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    campoValor: {
      color: cores.perigo,
      borderRadius: 10,
      flexGrow: 1,
      flexBasis: 140,
      minWidth: 0,
      backgroundColor: cores.campo,
      minHeight: 46,
      paddingHorizontal: 10,
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: 17
    },
    campo: {
      width: '100%',
      minHeight: 46,
      backgroundColor: cores.campo,
      color: cores.textoPrincipal,
      fontSize: 15,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginBottom: 14
    },
    campoCompleto: {
      paddingHorizontal: 16,
      marginBottom: 4
    },
    listaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.superficieSuave,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 10
    },
    iconeCaixa: {
      width: 38,
      height: 38,
      borderRadius: 8,
      backgroundColor: cores.superficieElevada,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10
    },
    listaItemTexto: {
      flexShrink: 1,
      color: cores.textoPrincipal,
      fontSize: 15,
      fontWeight: '600'
    },
    listaItemSecundario: {
      color: cores.textoSecundario,
      fontSize: 13,
      marginTop: 4
    },
    salvarEnvoltorio: {
      paddingHorizontal: 16,
      marginTop: 8,
      marginBottom: 16
    },
    salvarBotao: {
      backgroundColor: cores.primaria,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center'
    },
    salvarBotaoTexto: {
      color: cores.sobrePrimaria,
      fontWeight: '600',
      fontSize: 15
    }
  });

  // novaReceita
  const estilosNovaReceita = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    titulo: {
      flexShrink: 1,
      color: cores.textoPrincipal,
      marginLeft: 10,
      fontSize: 19,
      fontWeight: '600'
    },
    adicionarValor: {
      flexWrap: 'wrap',
      gap: 12,
      flexDirection: 'row',
      backgroundColor: cores.superficieSuave,
      padding: 12,
      margin: 16,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    campoValor: {
      color: cores.sucesso,
      borderRadius: 10,
      flexGrow: 1,
      flexBasis: 140,
      minWidth: 0,
      backgroundColor: cores.campo,
      minHeight: 46,
      paddingHorizontal: 10,
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: 17
    },
    campo: {
      width: '100%',
      minHeight: 46,
      backgroundColor: cores.campo,
      color: cores.textoPrincipal,
      fontSize: 15,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginBottom: 14
    },
    campoCompleto: {
      paddingHorizontal: 16,
      marginBottom: 4
    },
    listaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.superficieSuave,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 10
    },
    iconeCaixa: {
      width: 38,
      height: 38,
      borderRadius: 8,
      backgroundColor: cores.superficieElevada,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10
    },
    listaItemTexto: {
      flexShrink: 1,
      color: cores.textoPrincipal,
      fontSize: 15,
      fontWeight: '600'
    },
    listaItemSecundario: {
      color: cores.textoSecundario,
      fontSize: 13,
      marginTop: 4
    },
    salvarEnvoltorio: {
      paddingHorizontal: 16,
      marginTop: 8,
      marginBottom: 16
    },
    salvarBotao: {
      backgroundColor: cores.primaria,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center'
    },
    salvarBotaoTexto: {
      color: cores.sobrePrimaria,
      fontWeight: '600',
      fontSize: 15
    }
  });

  // novaSenha
  const estilosNovaSenha = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      justifyContent: 'center',
      paddingHorizontal: 24
    },
    conteudo: {
      width: '100%',
      alignItems: 'center'
    },
    descricao: {
      color: cores.textoSecundario,
      fontSize: 15,
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 22
    },
    rotulo: {
      width: '100%',
      color: cores.textoPrincipal,
      fontSize: 15,
      marginTop: 11,
      fontWeight: '600'
    },
    campo: {
      width: '100%',
      minHeight: 55,
      backgroundColor: cores.superficie,
      borderRadius: 12,
      paddingHorizontal: 15,
      fontSize: 16,
      color: cores.textoPrincipal,
      marginTop: 15
    },
    botao: {
      width: '100%',
      height: 45,
      backgroundColor: cores.primaria,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
    botaoTexto: {
      color: cores.sobrePrimaria,
      fontSize: 15,
      fontWeight: 'bold'
    },
    erro: {
      color: cores.perigo,
      fontSize: 13,
      marginTop: 8
    }
  });

  // perfil
  const estilosPerfil = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    perfilRecipiente: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 10,
      marginBottom: 30
    },
    perfilCirculo: {
      width: 85,
      height: 85,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: cores.borda,
      justifyContent: 'center',
      alignItems: 'center'
    },
    perfilInformacoes: {
      marginLeft: 18,
      flex: 1
    },
    settingsBotao: {
      marginLeft: 'auto',
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center'
    },
    nome: {
      color: cores.textoPrincipal,
      fontSize: 24,
      fontWeight: 'bold'
    },
    email: {
      color: cores.textoSecundario,
      fontSize: 15,
      marginTop: 4
    },
    resumoCartao: {
      backgroundColor: cores.superficie,
      marginHorizontal: 15,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: cores.borda,
      marginBottom: 25
    },
    resumoTitulo: {
      color: cores.textoPrincipal,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20
    },
    resumoLinha: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    itemResumo: {
      alignItems: 'center',
      flex: 1
    },
    rotuloResumo: {
      color: cores.textoSecundario,
      fontSize: 12,
      marginTop: 8,
      marginBottom: 5,
      textAlign: 'center'
    },
    valorResumo: {
      color: cores.textoPrincipal,
      fontWeight: 'bold',
      fontSize: 13,
      textAlign: 'center'
    },
    menuCartao: {
      backgroundColor: cores.superficie,
      marginHorizontal: 15,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: cores.borda,
      marginBottom: 20,
      overflow: 'hidden'
    },
    itemMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda
    },
    itemEsquerda: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemTexto: {
      flexShrink: 1,
      color: cores.textoPrincipal,
      fontSize: 16,
      marginLeft: 15
    },
    modalFundo: {
      flex: 1,
      backgroundColor: cores.sobreposicao,
      justifyContent: 'center',
      alignItems: 'center'
    },
    modal: {
      maxWidth: 520,
      width: '85%',
      backgroundColor: cores.superficie,
      borderRadius: 25,
      padding: 25,
      alignItems: 'center'
    },
    modalIcone: {
      width: 75,
      height: 75,
      borderRadius: 40,
      backgroundColor: cores.primaria,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20
    },
    modalTitulo: {
      color: cores.textoPrincipal,
      fontSize: 24,
      fontWeight: 'bold'
    },
    modalTexto: {
      color: cores.textoSecundario,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 12,
      marginBottom: 30
    },
    modalBotoes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
    cancelar: {
      width: '47%',
      minHeight: 50,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: cores.primaria,
      justifyContent: 'center',
      alignItems: 'center'
    },
    cancelarTexto: {
      color: cores.textoPrincipal,
      fontSize: 16,
      fontWeight: 'bold'
    },
    sair: {
      width: '47%',
      minHeight: 50,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 15,
      backgroundColor: cores.primaria,
      justifyContent: 'center',
      alignItems: 'center'
    },
    sairTexto: {
      color: cores.sobrePrimaria,
      fontSize: 16,
      fontWeight: 'bold'
    }
  });

  // recuperarSenha
  const estilosRecuperarSenha = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      justifyContent: 'center',
      paddingHorizontal: 24
    },
    conteudo: {
      width: '100%',
      alignItems: 'center'
    },
    descricao: {
      color: cores.textoSecundario,
      fontSize: 15,
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 22
    },
    campoRecipiente1: {
      width: '100%',
      marginBottom: 20
    },
    campo: {
      width: '100%',
      minHeight: 55,
      backgroundColor: cores.superficie,
      borderRadius: 12,
      paddingHorizontal: 15,
      fontSize: 16,
      color: cores.textoPrincipal,
      marginTop: 25
    },
    botao: {
      width: '100%',
      height: 45,
      backgroundColor: cores.primaria,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
    botaoTexto: {
      color: cores.sobrePrimaria,
      fontSize: 15,
      fontWeight: 'bold'
    },
    voltar: {
      color: cores.textoPrincipal,
      fontSize: 16,
      marginTop: 20,
      textDecorationLine: 'underline'
    },
    erro: {
      color: cores.perigo,
      fontSize: 13,
      marginTop: 8
    }
  });

  // relatorios
  const estilosRelatorios = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    cartao: {
      backgroundColor: cores.superficie,
      marginHorizontal: 18,
      marginBottom: 5,
      marginTop: 20,
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: cores.borda
    },
    cartaoTitulo: {
      color: cores.textoPrincipal,
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15
    },
    pickerRecipiente: {
      backgroundColor: cores.superficie,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: cores.borda,
      overflow: 'hidden'
    },
    picker: {
      color: cores.textoPrincipal,
      height: 55
    },
    itemResumo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda
    },
    textos: {
      marginLeft: 15,
      flex: 1
    },
    rotulo: {
      color: cores.textoSecundario,
      fontSize: 15,
      marginBottom: 3
    },
    valor: {
      color: cores.textoPrincipal,
      fontSize: 20,
      fontWeight: 'bold'
    },
    botao: {
      backgroundColor: cores.primaria,
      padding: 14,
      marginHorizontal: 18,
      marginTop: 10,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    botaoTexto: {
      color: cores.sobrePrimaria,
      fontSize: 17,
      fontWeight: 'bold',
      marginLeft: 10
    }
  });

  // sobreApp
  const estilosSobreApp = StyleSheet.create({
    recipiente: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'stretch',
      paddingHorizontal: 10
    },
    mainCartao: {
      backgroundColor: cores.superficie,
      marginHorizontal: 18,
      marginTop: 10,
      borderRadius: 16,
      paddingVertical: 24,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginBottom: 18,
      borderWidth: 1,
      borderColor: cores.borda
    },
    appNome: {
      color: cores.textoPrincipal,
      fontSize: 28,
      fontWeight: '600'
    },
    featuresCartao: {
      backgroundColor: cores.featuresCard,
      marginHorizontal: 18,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: cores.borda,
      padding: 16,
      marginBottom: 18
    },
    featuresTitulo: {
      color: cores.textoPrincipal,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12
    },
    destaqueLinha: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 14
    },
    destaqueIcone: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12
    },
    destaqueTexts: {
      flex: 1
    },
    destaqueTitulo: {
      color: cores.textoPrincipal,
      fontSize: 15,
      fontWeight: '700'
    },
    destaqueTexto: {
      color: cores.textoSecundario,
      fontSize: 13,
      marginTop: 4
    },
    informacoesCartao: {
      backgroundColor: cores.superficie,
      marginHorizontal: 18,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: cores.borda
    },
    informacoesTitulo: {
      color: cores.textoPrincipal,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 6
    },
    informacoesTexto: {
      color: cores.textoSecundario,
      fontSize: 13
    },
    contatoCartao: {
      backgroundColor: cores.superficie,
      marginHorizontal: 18,
      borderRadius: 14,
      padding: 14,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: cores.borda,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    contatoEsquerda: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    contatoTexto: {
      flexShrink: 1,
      color: cores.textoPrincipal,
      fontSize: 15,
      marginLeft: 10
    },
    rodape: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30
    },
    rodapeApp: {
      color: cores.textoSecundario,
      fontSize: 14,
      marginBottom: 6
    },
    rodapeCopy: {
      color: cores.textoSecundario,
      fontSize: 12
    }
  });
  const estilosTeclado = StyleSheet.create({
    autenticacaoRolagemConteudo: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      paddingTop: 24,
      paddingBottom: 48
    },
    autenticacaoFormulario: {
      width: '100%',
      flexShrink: 0
    },
    desvioArea: {
      flex: 1
    },
    centralizadoRolagemConteudo: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: 24,
      paddingBottom: 48
    },
    rolagemConteudo: {
      flexGrow: 1,
      paddingBottom: 120
    },
    modalRolagemConteudo: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: 24
    }
  });
  const estilosCompartilhados = StyleSheet.create({
    erroTexto: {
      color: cores.perigo,
      fontSize: 14,
      marginVertical: 10,
      textAlign: 'center'
    },
    flexivel: {
      minWidth: 0,
      flex: 1
    },
    espacamentoInferior120: {
      paddingBottom: 120
    },
    espacamentoInferior130: {
      paddingBottom: 130
    },
    espacamentoInferior150: {
      paddingBottom: 150
    },
    linhaCentralizado: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    telaCabecalhoLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    formularioRotulo: {
      color: cores.textoPrincipal,
      marginLeft: 10,
      marginBottom: 5,
      fontSize: 16
    },
    entradaLogo: {
      flexShrink: 0,
      alignSelf: 'center',
      width: 150,
      height: 150,
      marginBottom: 24
    },
    relatorioGrafico: {
      borderRadius: 15,
      marginTop: 10,
      marginBottom: 5
    },
    progressoPercentual: {
      color: cores.textoPrincipal,
      fontSize: 22,
      fontWeight: 'bold'
    },
    suaveLegenda: {
      color: cores.textoSuave,
      fontSize: 12
    },
    textoAlinhamentoDireita: {
      textAlign: 'right'
    },
    multilinhaCampo: {
      minHeight: 100,
      textAlignVertical: 'top'
    },
    positivoTexto: {
      color: cores.sucesso
    },
    negativoTexto: {
      color: cores.perigo
    },
    destaqueRoxo: {
      backgroundColor: cores.destaqueRoxo
    },
    destaqueAzul: {
      backgroundColor: cores.destaqueAzul
    },
    destaqueVioleta: {
      backgroundColor: cores.destaqueVioleta
    },
    destaqueVermelho: {
      backgroundColor: cores.destaqueVermelho
    }
  });
  const opcoesTelasNavegacao = {
    headerShown: false,
    headerStyle: {
      backgroundColor: cores.fundo
    },
    headerTintColor: cores.textoPrincipal,
    headerTitleStyle: {
      fontWeight: '600'
    },
    contentStyle: {
      backgroundColor: cores.fundo
    }
  };
  return {
    cores,
    gradientes,
    estilosBarraNavegacao,
    estilosBoasVindas,
    estilosCadastro,
    estilosCentralAjuda,
    estilosConfiguracoes,
    estilosCriarSenha,
    estilosPainel,
    estilosFluxoFinanceiro,
    estilosInicio,
    estilosLogin,
    estilosMetas,
    estilosMeuCadastro,
    estilosNotificacoes,
    estilosNovaDespesa,
    estilosNovaReceita,
    estilosNovaSenha,
    estilosPerfil,
    estilosRecuperarSenha,
    estilosRelatorios,
    estilosSobreApp,
    estilosTeclado,
    estilosCompartilhados,
    opcoesTelasNavegacao
  };
}
const cache = new WeakMap();
export function useEstilosApp() {
  const {
    cores
  } = useTema();
  if (!cache.has(cores)) cache.set(cores, criarEstilosApp(cores));
  return cache.get(cores);
}
