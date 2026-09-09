# Layout e teclado

As telas usam áreas seguras superiores, laterais e inferiores. O cabeçalho automático
do navegador está desativado: ScreenHeader renderiza título e seta de voltar dentro
da tela, e sua altura medida é considerada pelo teclado. O conteúdo fica com largura máxima
de 960 pontos; os formulários, com 560. A orientação acompanha o dispositivo.

`components/FormLayout.jsx` centraliza o tratamento do teclado. No iOS, considera
a altura do cabeçalho e oferece o botão Concluir. No Android, não reduz a altura
novamente quando a janela já foi redimensionada pelo sistema. Qualquer área sobreposta pelo
teclado vira espaço extra no fim do formulário, permitindo rolar até o último campo.
O campo ativo é medido após a abertura do teclado, mudanças de conteúdo e o fim
do redimensionamento da janela. Não combinar esse componente com outro
KeyboardAvoidingView ou com automaticallyAdjustKeyboardInsets habilitado.

Login e cadastro usam conteúdo alinhado ao topo, sem animações de entrada, com
imagem e formulário sem encolhimento. O recorte de filhos da rolagem está desativado.
Ao fechar o teclado, essas duas telas voltam ao topo; a rolagem manual não dispara
reposicionamento automático do campo ativo.

Novos formulários devem usar KeyboardArea, FormScrollView e FormInput. Para modais,
usar a propriedade `modal` em KeyboardArea, pois o cabeçalho da rota fica fora
do modal. Os gráficos usam MeasuredChart para medir o espaço real do cartão.

## Verificação realizada

- Testes de geometria com `node --test tests/keyboardGeometry.test.mjs`: teclado
  sobreposto, janela já redimensionada, troca de campo, fechamento e teclado flutuante.

- Lint sem erros; avisos de imports não utilizados já existentes em Central de
  Ajuda e Sobre o App.
- Exportação web e pacotes JavaScript de iOS/Android. O executável Hermes teve
  execução negada neste ambiente Windows; a validação nativa usa `--no-bytecode`,
  sem alterar o motor do aplicativo.
- Navegador: boas-vindas e login com largura de 320; login em 768 × 1024;
  cadastro em 844 × 390, com o último campo e Continuar acessíveis por rolagem.

## Verificação em aparelhos

A prévia web não reproduz o teclado nativo, recortes ou todos os comportamentos
de janela do iOS/Android. Antes de distribuir, conferir em iPhone, iPad e Android:

1. Abrir o teclado no primeiro e no último campo de cada formulário: cadastro,
   login, senhas, recuperação, meu cadastro, receita, despesa e modal de metas.
2. Alternar entre teclado numérico, email e observação multilinha; rolar, fechar
   e reabrir o teclado. Conferir o botão Concluir no iOS.
3. Girar o aparelho, usar tela dividida no tablet e aumentar a fonte do sistema.
4. Conferir gráficos, textos longos, valores altos, navegação e menus expandidos.
5. Verificar botões próximos à barra de gestos e dispositivos com recorte lateral.

Mudanças de orientação e configuração nativa exigem uma nova compilação do app
instalado. O suporte depende das versões de sistema operacional aceitas pelo Expo
SDK utilizado; responsividade não torna aparelhos antigos compatíveis com o SDK.
