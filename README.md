# Tomi chat app

## Get started

### Configure Infura

The Tomi Mesh uses Infura to enable wallet apps to connect to the Ethereum blockchain.

Add your Infura API key to `.env.local` at the root of `xmtp-inbox-web`.

### Install the package

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the app.

## Functionality

### Wallet connections

The Tomi Mesh uses [RainbowKit](https://www.rainbowkit.com/) to enable users to connect a Coinbase Wallet, MetaMask, Rainbow, Trust Wallet, or WalletConnect-compatible wallet app.

> **Note**  
> As of WalletConnect v2, a project id is required. This is currently hardcoded with a placeholder value, but if you'd like to use WalletConnect, you can [generate your own](https://www.rainbowkit.com/docs/migration-guide#2-supply-a-walletconnect-cloud-projectid) and edit the placeholder value in `main.tsx`.

This app also uses a [viem Account](https://viem.sh/docs/accounts/privateKey.html) interface to sign transactions and messages with a given private key. The XMTP message API client needs this Account to enable and sign messages that create and enable their XMTP identity. This XMTP identity is what enables a user to send and receive messages.

Specifically, the user must provide two signatures using their connected blockchain account:

1. A one-time signature that is used to generate the account's private XMTP identity
2. A signature that is used on app startup to enable, or initialize, the XMTP message API client with that identity

### Chat conversations

The Tomi Mesh uses the `xmtp-js` [Conversations](https://github.com/xmtp/xmtp-js#conversations) abstraction to list the available conversations for a connected wallet and to listen for or create new conversations. For each conversation, the app gets existing messages and listens for or creates new messages.

### Accessibility

Tomi Mesh is built with Web Content Accessibility Guidelines (WCAG) AA compliance guidelines in mind.

To learn more about WCAG and building accessible web apps, see [WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/).

### Localization

Tomi Mesh supports localization. If you'd like to contribute a translation of Tomi Mesh UI text, use the existing JSON files in the [`locales` folder](locales) as a starting point. Then, add your translated JSON file to the `locales` folder.

### Tests

Tests will be run with any pull request. To run tests locally, you may use the following commands:

Unit tests:

```bash
npm run test
```

End-to-end Cypress tests:

```bash
npm run e2e:headless
```

Component tests:

```bash
npm run cypress:component
```

### Considerations

You can't use an app built with XMTP to send a message to a blockchain account address that hasn't used XMTP. This app displays an error when it looks up an address that doesn't have an identity already registered on the XMTP network.
