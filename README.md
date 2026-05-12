# Screenora 📱💻📺

<p align="center">
  <img src="screenora-capa.png" alt="Screenora Cover" width="100%">
</p>

O **Screenora** é uma ferramenta avançada de visualização responsiva que permite testar seus sites e aplicações em múltiplos dispositivos simulados simultaneamente. Ideal para desenvolvedores e designers que precisam garantir a qualidade visual em qualquer tela.

---

## ✨ Funcionalidades Principais

- 🔄 Visualização Simultânea: Teste layouts em resoluções de Mobile, Tablet e Desktop lado a lado.
- 📜 Universal Scroll: Role a página em um dispositivo e todos os outros rolarão sincronizados.
- 🧩 Extensão Dedicada: Remove cabeçalhos de bloqueio de iframe para carregar qualquer URL.
- 🎨 Interface Premium: Design escuro, moderno e focado na experiência do usuário.

---

## 🛠️ Como Executar o Aplicativo

Este é um projeto desenvolvido com [Next.js](https://nextjs.org/).

### Passo 1: Instalar dependências
No terminal, na raiz do projeto, execute:
```bash
npm install
```

### Passo 2: Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

### Passo 3: Acessar no navegador
Abra [http://localhost:3000](http://localhost:3000) para ver o Screenora em ação.

---

## 🔌 Como Instalar a Extensão (Necessário para carregar sites externos)

Para que o Screenora consiga carregar sites que bloqueiam `iframes`, instale a extensão que está na pasta `extension Screenora`:

1. Abra o Google Chrome.
2. Acesse `chrome://extensions/` (ou vá em Menu > Mais ferramentas > Extensões).
3. Ative o **"Modo do desenvolvedor"** no canto superior direito.
4. Clique em **"Carregar sem compactação"** no canto superior esquerdo.
5. Selecione a pasta `extension Screenora` que está dentro deste projeto.
6. Pronto! Agora você pode testar qualquer URL no Screenora.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usar, modificar e distribuir.
