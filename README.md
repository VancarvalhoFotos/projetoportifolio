# Site Vanessa Carvalho Fotografias

Site institucional para Vanessa Carvalho Fotografias, especializada em ensaios fotográficos de bebês e gestantes.

## Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- EJS (Template Engine)
- Cloudinary (para armazenamento de imagens)

## Requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- Conta no Cloudinary (opcional, para armazenamento de imagens)

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd vanessa-carvalho-fotografias
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
DATABASE_URL=sua_url_do_postgresql
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
SESSION_SECRET=seu_secret_para_sessao
```

4. Configure o banco de dados:
```bash
psql -U seu_usuario -d seu_banco -f src/database/schema.sql
```

5. Inicie o servidor:
```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
vanessa-carvalho-fotografias/
├── src/
│   ├── config/
│   │   └── database.js
│   │   └── schema.sql
│   ├── routes/
│   │   └── index.js
│   ├── views/
│   │   └── index.ejs
│   └── server.js
├── public/
│   ├── css/
│   │   └── style.css
│   └── images/
├── .env
├── package.json
└── README.md
```

## Funcionalidades

- Página inicial com apresentação dos serviços
- Portfólio dinâmico
- Formulário de contato
- Design responsivo
- Integração com Cloudinary para armazenamento de imagens
- Sistema de gerenciamento de portfólio

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 