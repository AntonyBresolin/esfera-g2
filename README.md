# <p align="center"> Esfera Pró Soluções Empresariais - Sistema de Gerenciamento de Vendas (CRM) </p>

## Descrição do Projeto
<p align="justify">O sistema Esfera é um sistema CRM voltado para o controle de contatos, ligações e propostas geradas.</p>

<p align="justify"> O MVP foi desenvolvido para fins educacionais e de aprendizado em parceria da instituição de ensino
Biopark Educação e da Empresa de comunicação, Esfera Pró Soluções Empresariais. </p>

## Status do Projeto
<h4 align="center"> 
    ✔️ Esfera 🚀 MVP concluido com sucesso. ✔️
</h4>

## Features
- [x] Cadastro de clientes
- [x] Cadastro de Ligações realizadas
- [x] Cadastro de Propostas geradas
- [x] Cadastro de Usuários
- [x] Download de relatórios em CSV
- [x] Controle de acesso, login e logout
- [x] Importação de lista de clientes em CSV
- [x] Download de lista de ligações realizadas em CSV
- [x] Download de lista de propostas geradas em CSV
- [x] Anexar arquivos PDF em propostas geradas
- [x] Download de arquivos PDF anexados em propostas geradas
- [x] Cadastro, edição, visualização e exclusão de clientes, ligações e propostas
- [x] Vincular e linkar Whatsapp do cliente em seu cadastro
- [x] Exclusão segura de clientes, ligações e propostas (O sistema identifica caso esteja sendo utilizado em outro lugar e impede a exclusão.).
- [x] Relatório de propostas e ligações realizados por usuário
- [x] Kanban de Tarefas e atividades a serem realizadas
- [x] Aba de configurações para alterar senha e dados do usuário
- [x] Aba de Perguntas Frequentes

## Imagens do sistema Esfera:

### Tela de Login:
![img.png](imagesREADME%2Fimg.png)
### Tela de Relatório de propostas e ligações realizados por usuário:
![img_1.png](imagesREADME%2Fimg_1.png)
### Popup de cadastro de Tarefa no kanbam:
![img_2.png](imagesREADME%2Fimg_2.png)
### Tela de clientes:
![img_3.png](imagesREADME%2Fimg_3.png)
### Cadastro de ligação a partir de um cliente selecionado:
![img_4.png](imagesREADME%2Fimg_4.png)
### Edição de Cliente:
![img_5.png](imagesREADME%2Fimg_5.png)
### Exclusão de Cliente:
![img_6.png](imagesREADME%2Fimg_6.png)
### Alerta de exclusão de cliente, com dados vinculados:
![img_8.png](imagesREADME%2Fimg_8.png)
### Importação de lista de clientes em CSV:
![img_7.png](imagesREADME%2Fimg_7.png)
### Tela de ligações:
![img_9.png](imagesREADME%2Fimg_9.png)
### Listagem de ligações realizadas no dia:
![img_10.png](imagesREADME%2Fimg_10.png)
### Cadastro de proposta a partir de uma ligação selecionada:
![img_11.png](imagesREADME%2Fimg_11.png)
### Tela de propostas:
![img_12.png](imagesREADME%2Fimg_12.png)
### Edição de proposta:
![img_13.png](imagesREADME%2Fimg_13.png)
### Exportação de propostas/ligações loading:
![img_14.png](imagesREADME%2Fimg_14.png)

### Exemplo de Relatório de propostas e ligações realizados por usuário
#### Ligações:
![img_15.png](imagesREADME%2Fimg_15.png)
#### Propostas:
![img_16.png](imagesREADME%2Fimg_16.png)


## Principais Tecnologias Utilizadas
- Java 17
- Spring Boot MVC
- Thymeleaf
- MySQL
- Maven
- JPA
- Hibernate
- Spring DevTools
- JUnit e Mockito
- HTML, CSS, JavaScript e tailwindcss


## Pré-requisitos para rodar o projeto (Desenvolvimento)
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
 - Java 17
 - Maven 3.8.1
 - MySQL

## Rodando o Back End (servidor/frontend)
```bash
# Clone este repositório
$ git clone <
$ cd esfera-g2
$ cd backend
$ mvn clean install
# Ou mvn clean install -DskipTests
$ mvn spring-boot:run
# O servidor inciará na porta:8080 - acesse http://localhost:8080
## Usuario e senha padrão
## usuario: admin@admin.com
## senha: admin
```

### Passos para deploy do projeto
Você precisará de um servidor com VPS ou Cloud para hospedar o projeto, e um banco de dados MySQL.
- Necessitará do docker
- Necessitará de uma imagem do MySQL
- Necessitará de uma imagem do Java 17 com Maven
- Necessitará de que os containers estejam na mesma rede
- Após isso, execute um container com a imagem do MySQL e outro com a imagem do Java 17 com Maven
- Execute o comando mvn clean install -DskipTests no container do Java 17 com Maven
- Execute o comando mvn spring-boot:run no container do Java 17 com Maven
- Acesse o endereço IP do container do Java 17 com Maven na porta 8080
- O sistema estará rodando


<h2 align="center"> Nossa equipe: </h2>

## Desenvolvedores:
- [Antony Henrique Bresolin](https://github.com/AntonyBresolin)
- [Gabriel Antonio Xander](https://github.com/Gabriel-Xander)
- [João Paulo B. Haupt](https://github.com/JoaoPBHaupt)
- [Gustavo Jesus](https://github.com/JESUISzin)

## Analistas:
- [Antony Henrique Bresolin](https://github.com/AntonyBresolin)
- [Lucas Dreveck](https://github.com/Lucas-Dreveck)
- [Vitor Duarte](https://github.com/ctrlVi)
- [Gabriel Costa](https://github.com/gabrielscostaa)