# Contributing / Katkı

Use Node.js 24.13.1 (24.x supported). In a clean checkout without `.env`:

```sh
npm ci --ignore-scripts
npm run check
npm audit --audit-level=low
```

Keep changes small and describe observable behavior. Add meaningful domain or
interaction tests for changed behavior. Keep permissions/intents minimal, fixed
Turkish and English text clear, error responses free of REST details and all public
actions explicit. Never commit real tokens or a test server's personal data.
CI uses mocked interactions on Linux, Windows and macOS, not a live Discord server.
Manual installation and accessible/mobile UI checks require a separate test
application and consenting test server. Avoid testing against production communities.
Submit pull requests against main. Contributions use the MIT license.

Türkçe: Node.js 24.13.1 ile `.env` olmayan temiz kopyada yukarıdaki kontrolleri çalıştırın.
Değişikliği küçük tutun, gerçek davranışı açıklayın, ilgili hesap/etkileşim testlerini
ekleyin. İzinleri artırmayın, iki dilde metinleri ve açık paylaşım onayını koruyun.
Token/kişisel veri göndermeyin. CI gerçek Discord sunucusu kullanmaz; canlı kurulum,
mobil ve ekran okuyucu denemelerini ayrı uygulamada ve izinli test sunucusunda yapın.
Katkılar MIT kapsamındadır.
