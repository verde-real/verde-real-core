export interface SecaoLegal {
  id: string;
  titulo: string;
  paragrafos: string[];
}

export const VERSAO_TERMOS = '2026-10-01';
export const DATA_ATUALIZACAO_TERMOS = '1 de outubro de 2026';
export const EMAIL_CONTATO_LEGAL = 'contatoverdereal@gmail.com'; // TODO: e-mail oficial de contato

export const TERMOS_DE_USO: SecaoLegal[] = [
  {
    id: 'sobre',
    titulo: '1. O que é o Verde Real',
    paragrafos: [
      'O Verde Real é uma rede social de transparência ambiental. Nela, pessoas podem registrar denúncias sobre práticas que parecem greenwashing (propaganda ambiental enganosa), e empresas podem se apresentar e solicitar o Selo Verde.',
    ],
  },
  {
    id: 'conta',
    titulo: '2. Conta e cadastro',
    paragrafos: [
      'Para publicar e interagir você precisa criar uma conta como Cliente ou como Empresa. Você se compromete a informar dados verdadeiros e a manter seu e-mail e sua senha em sigilo.',
      'Você declara ter capacidade legal para aceitar estes termos. Você é responsável pelas atividades feitas na sua conta.',
    ],
  },
  {
    id: 'denuncias',
    titulo: '3. Denúncias e conteúdo publicado',
    paragrafos: [
      'Denúncias devem ser feitas de boa-fé, baseadas em fatos e, sempre que possível, acompanhadas de provas (imagens, links, documentos).',
      'Não é permitido publicar conteúdo falso, ofensivo, discriminatório ou difamatório, nem expor dados pessoais de terceiros. Quem publica é o responsável pelo que publica.',
      'O Verde Real pode ocultar ou remover conteúdo que viole estes termos ou a lei.',
    ],
  },
  {
    id: 'empresas',
    titulo: '4. Empresas e Selo Verde',
    paragrafos: [
      'Empresas devem fornecer informações verdadeiras ao solicitar o Selo Verde. O selo é concedido após análise e pode ser retirado se as informações se mostrarem falsas ou se as condições deixarem de ser cumpridas.',
      'O Selo Verde não é uma certificação oficial nem garantia legal de conformidade ambiental.',
    ],
  },
  {
    id: 'transparencia',
    titulo: '5. Moderação e transparência',
    paragrafos: [
      'Empresas citadas em denúncias podem responder dentro da plataforma. Se você acredita que um conteúdo ou uma decisão de moderação foi indevida, pode pedir revisão pelo e-mail de contato abaixo.',
    ],
  },
  {
    id: 'responsabilidade',
    titulo: '6. Limites de responsabilidade',
    paragrafos: [
      'O conteúdo publicado pelos usuários representa a opinião de quem o publicou, e não do Verde Real. Fazemos o possível para manter o serviço disponível, mas ele pode sofrer interrupções.',
    ],
  },
  {
    id: 'alteracoes',
    titulo: '7. Alterações e contato',
    paragrafos: [
      'Podemos atualizar estes termos. Mudanças relevantes serão avisadas na plataforma. Dúvidas: ' + EMAIL_CONTATO_LEGAL + '.',
    ],
  },
];

export const POLITICA_PRIVACIDADE: SecaoLegal[] = [
  {
    id: 'dados',
    titulo: '1. Quais dados coletamos',
    paragrafos: [
      'Dados de cadastro: nome ou razão social, e-mail, tipo de perfil (Cliente ou Empresa) e nome de usuário (@).',
      'Dados que você cria: foto de perfil (se enviar), denúncias, imagens, comentários, curtidas e notificações.',
    ],
  },
  {
    id: 'uso',
    titulo: '2. Para que usamos',
    paragrafos: [
      'Para criar e proteger sua conta, permitir o login, exibir suas publicações, enviar notificações da plataforma, moderar conteúdo e cumprir obrigações legais.',
    ],
  },
  {
    id: 'publico',
    titulo: '3. O que é público',
    paragrafos: [
      'Seu nome, nome de usuário, foto e o conteúdo que você publica podem ser vistos por outros usuários. Sua senha nunca é exibida nem armazenada em texto legível.',
    ],
  },
  {
    id: 'compartilhamento',
    titulo: '4. Compartilhamento',
    paragrafos: [
      'Não vendemos seus dados. Usamos provedores de infraestrutura (banco de dados, autenticação e armazenamento) que tratam os dados apenas para o funcionamento do serviço.',
    ],
  },
  {
    id: 'direitos',
    titulo: '5. Seus direitos (LGPD)',
    paragrafos: [
      'Você pode pedir acesso, correção, exclusão, portabilidade dos seus dados e revogar consentimentos. Para isso, escreva para ' + EMAIL_CONTATO_LEGAL + '.',
    ],
  },
  {
    id: 'seguranca',
    titulo: '6. Segurança e guarda dos dados',
    paragrafos: [
      'Adotamos medidas técnicas para proteger seus dados e os mantemos enquanto sua conta existir ou enquanto a lei exigir.',
    ],
  },
];