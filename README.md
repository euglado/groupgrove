# GroupGrove

[Türkçe](#türkçe) · [English](#english) · [Privacy / Gizlilik](PRIVACY.md) · [Security / Güvenlik](SECURITY.md)

## Türkçe

### Amaç

GroupGrove, Discord içindeki atölye, çalışma ve topluluk etkinlikleri için **dengeli
grup büyüklüğü planlayan gerçek bir Discord botudur**. Toplam kişi sayısını, grup
başına alt ve üst sınırı yazın; özel önizlemeyi inceleyip yalnızca isterseniz aynı
kanalda paylaşın. Üye adlarını toplamanız veya kaynak kod düzenlemeniz gerekmez.

Örnek: 23 kişi, grup başına 4–6 kişi → **3 grup × 6 kişi + 1 grup × 5 kişi**.
İsterseniz `groups:5` seçerek **3 grup × 5 kişi + 2 grup × 4 kişi** planlayın.

### Özellikler ve sınırlar

- `/groupgrove` komutunda tıklanabilir Discord sayı alanları ve dil seçimi.
- Özel önizlemede **Bu kanalda paylaş** veya **Vazgeç** düğmeleri.
- 2–1000 kişi; grup başına 2–50 kişi; isteğe bağlı 1–500 grup.
- Grup sayısı verilmezse uygun en az sayıda grup seçilir. Herkes tam bir kez sayılır;
  grup büyüklükleri arasındaki fark en çok bir kişidir. Uygun grup sayısı aralığı gösterilir.
- Sınırlar olanaksızsa anlaşılır hata; kimseyi dışarıda bırakıp sessizce devam etmez.
- Türkçe ve İngilizce sonuç; dil seçilmezse komutu kullananın Discord dili esas alınır
  (Türkçe dışında İngilizce).
- Yalnızca Sunucuyu Yönet yetkili organizatörler kullanır; her paylaşım öncesi yeniden kontrol.

Kişileri gruplara **atamaz**; katılım, yetenek, arkadaşlık, erişilebilirlik veya
adillik ölçmez. Eşleştirme, rastgele çekiliş, ses taşıma, takvim, hatırlatma,
rol değişikliği, mesaj okuma, özel mesaj, kayıt listesi, veri tabanı ve analitik yoktur.
İsim girişi yoktur. İnsanlar katılım ve erişilebilirlik tercihlerini birlikte kararlaştırır.
Bir sunucu, tek çalışan süreç için tasarlanmıştır. Repo'yu indirmek botu çevrimiçi yapmaz.

### Gereksinimler

- Windows, macOS veya Linux; [Node.js](https://nodejs.org/en/download) **24.x, en az 24.13.0**
  (CI: 24.13.1) ve birlikte gelen npm. Node 22/26 bu sürümün destek kapsamı dışındadır.
- İnternet erişimi; Discord uygulaması ve bot tokenı; kendi test sunucunuz.
- Botu eklemek ve komutu kullanmak için sunucuda **Sunucuyu Yönet** yetkisi.
- Sürekli kullanım için açık kalan bilgisayar veya Node 24 destekleyen sunucu.
  GitHub Actions botu barındırmaz; yalnızca kodu test eder.

### Baştan sona kurulum

1. [Discord Developer Portal](https://discord.com/developers/applications) → **New Application**.
   Ayrı bir uygulama oluşturun; General Information sayfasındaki **Application ID**'yi kopyalayın.
2. **Bot** sayfasına gidin. Gerekirse bot oluşturun; **Reset Token** ile token alın.
   Token parola gibidir: ekran görüntüsü, issue, sohbet veya GitHub'a koymayın.
   **Presence, Server Members ve Message Content** ayrıcalıklı intentlerini kapalı tutun.
3. **Installation** bölümünde **Guild Install** kullanın. OAuth2 scopes: `bot`,
   `applications.commands`. Bot izinleri yalnızca **View Channels** ve **Send Messages**
   (3072). Yönetici, Üyeleri Yönet, Rolleri Yönet veya Mesaj Geçmişini Oku vermeyin.
   Bir **Interactions Endpoint URL** eklemeyin; bot Gateway bağlantısını kullanır.
4. Discord Ayarlar → Gelişmiş → **Geliştirici Modu** açın. Sunucu simgesine sağ tıklayıp
   **Sunucu Kimliğini Kopyala** seçin. Kanal kimliği değil, sunucu kimliği gerekir.
5. Bu repo'da **Code → Download ZIP** seçin ve ZIP'i tamamen çıkarın. Node.js 24 kurduktan
   sonra yeni terminal açın. Windows'ta `setup.cmd` dosyasını çift tıklayın.
   macOS/Linux'ta çıkardığınız klasörde terminal açıp `bash setup.sh` çalıştırın.
   Kimlikleri girin; token sorusunda görünmeden yapıştırın ve Enter'a basın.
6. Kurulum yalnızca yerel `.env` oluşturur; var olan dosyayı ezmez. Kurulumun gösterdiği
   Discord ekleme bağlantısını açıp doğru sunucuya ekleyin. Portal'ın aynı kapsam ve
   izinlere sahip Install Link bağlantısını da kullanabilirsiniz.
7. Windows: `register.cmd`; macOS/Linux: `bash register.sh`.
   Bu adım yalnızca ayarlı sunucudaki `/groupgrove` komutunu ekler/günceller, başka
   komutları topluca silmez. Aynı uygulamada bu isimde eski komut varsa güncellenir.
8. Windows: `start.cmd`; macOS/Linux: `bash start.sh`. **GroupGrove bağlandı** mesajını
   görün. Terminal açık kalmalıdır; durdurmak için Ctrl+C.

Terminal yolunu tercih edenler, çıkarılan klasörde şu komutları kullanabilir:

```sh
npm ci --ignore-scripts
npm run setup
npm run register
npm start
```

PowerShell `npm.ps1` çalıştırmayı engellerse yürütme ilkesini değiştirmek yerine
`npm.cmd` kullanın veya sağlanan `.cmd` dosyalarını açın. Token girişinde karakterler
görünmez; bu beklenen davranıştır. Kurulum terminali etkileşimli olmalıdır.

### Yapılandırma

Kurulum `DISCORD_TOKEN`, `APPLICATION_ID`, `GUILD_ID` değerlerini `.env` dosyasına yazar.
Kaynak dosyalarını düzenlemeyin. Sunucu veya token değişirse önce botu durdurun;
`.env` dosyasını yerelden silip kurulumu yeniden çalıştırın. Token sızdıysa Portal'da
mutlaka yenileyin; yalnızca dosyayı silmek yetmez. `.env.example` sadece örnektir.
POSIX'te yeni dosya 0600 ile oluşturulur; Windows'ta klasörünüzün kullanıcı erişim
izinlerini kontrol edin. `.env` dosyasını ortak/senkronize klasörlere veya yedeklere koymayın.
Barındırma hizmetinde aynı üç değişkeni gizli ortam değişkeni olarak da tanımlayabilirsiniz.
Ortam değişkenleri `.env` değerlerinden önceliklidir; eski servis ayarlarını kontrol edin.

### Kullanım

1. Normal sunucu metin kanalında `/groupgrove` yazın. Sunucuyu Yönet izniniz olmalı.
2. `participants` toplam kişi; `minimum` ve `maximum` grup başına kişi sınırlarıdır.
   `groups` isteğe bağlı tam grup sayısı; `language` sonuç dilidir.
3. Örnek: `/groupgrove participants:23 minimum:4 maximum:6 language:tr`.
   Daha çok grup için `groups:5` ekleyin. Discord komut seçicisi alanları sırayla sunar.
4. Yalnızca size görünen önizlemede sayıları kontrol edin. **Bu kanalda paylaş** tek
   bir düz metin gönderir; **Vazgeç** taslağı siler. Başka kanala göndermez, kimseyi etiketlemez.
5. Önizleme beş dakika geçerlidir ve tek kullanımlıktır. Yeniden başlatınca kaybolur;
   eski düğmede yeni komut kullanmanız istenir. Süre dolunca eski önizleme metni Discord'da
   bir süre görünebilir ama düğmeler yayın yapamaz.

Her organizatör için beş saniye komut aralığı; kanal başına altmış saniye paylaşım
aralığı vardır. Devam eden gönderim boyunca kanal kilitlidir. Başarısız denemeler de
bekleme süresini tüketebilir. 100 taslak, 100 eşzamanlı kanal işlemi ve her bekleme
tablosunda 1000 kayıt sınırı vardır. Kopya süreçler çalıştırmayın; sınırlar RAM'dedir.

### İzinler ve güvenli varsayılanlar

Bot: **Kanalı Görüntüle + Mesaj Gönder**. Intent: yalnızca `Guilds`.
Kullanıcı: **Sunucuyu Yönet**, kanalda **Kanalı Görüntüle**, **Mesaj Gönder**,
**Uygulama Komutlarını Kullan**. Discord kanal/entegrasyon ayarları komutu ayrıca gizleyebilir.
Kanal türü normal metin olmalıdır; thread, forum, duyuru, DM ve ses kanalı desteklenmez.
Kanalda yavaş mod açıksa işlem reddedilir; ayrı planlama kanalı kullanabilirsiniz.
Üyelik taraması tamamlanmamış veya zaman aşımı uygulanmış hesaplarla paylaşım yapılmaz.
Botta Yönetici izni varsa paylaşım reddedilir; bu izni ve gereksiz rolleri kaldırın.

Paylaşım öncesi güncel sunucu, roller, kanal, üye ve bot bilgisi API'den alınır.
Son kontrol ile gönderim arasındaki yönetici değişikliği tamamen atomik olamaz.
REST hata ayrıntıları gösterilmez. Belirsiz gönderimde tekrar yapılmaz; hata alsanız bile
gönderi görünmüş olabilir. Yeniden denemeden kanalı kontrol edin.

### Gizlilik ve botu açık tutma

Sayılar, dil ve önizleme bağlam kimlikleri geçici RAM'dedir; mesaj geçmişi okunmaz.
Discord yine komut ve mesajları işler. Özel önizleme Discord/barındırma yöneticisinden
gizli değildir. Paylaşılan sayısal plan, taslak süresi bitse veya bot kaldırılsa bile
kanalda kalır; silmek için Discord'da gönderiyi elle silin. [Gizlilik belgesi](PRIVACY.md)
önbellek ve silme ayrıntılarını açıklar.

Bilgisayar uyursa, terminal kapanırsa veya internet kesilirse bot yanıt vermez.
24 saat kullanım için size ait bir Node 24 sunucusunda tek süreç çalıştırın; servis
yöneticisinde çalışma klasörünü repo klasörü, komutu `npm start` olarak belirleyin ve
ortam değişkenlerini gizli tutun. Tokenı komut satırına yazmayın. Bu repo uzaktan servis
kurmaz, VDS ayarı yapmaz. Yeniden başlatma taslakları ve beklemeleri sıfırlar.

### Sorun giderme

- **Komut görünmüyor:** Bot doğru sunucuda mı? `register` adımını tamamlayın;
  `applications.commands` kapsamını, Sunucuyu Yönet yetkisini ve kanal entegrasyon
  kısıtlarını kontrol edin. Discord'u yenileyin. ID'lerin aynı uygulamaya ait olduğundan emin olun.
- **Başlatılamadı/kayıt başarısız:** Node sürümünü (`node --version`), interneti, üç ayarı
  ve tokenın Portal'daki güncel bot tokenı olduğunu kontrol edin. Tokenı loga yapıştırmayın.
- **Plan yok:** Örneğin 3 kişiyi ikişerli gruplara bölmek olanaksızdır. Alt/üst sınırı
  genişletin veya gösterilen uygun aralıktaki grup sayısını seçin.
- **Paylaşım reddedildi:** Yönetici bot iznini kaldırın; kanal izinlerini, yavaş modu,
  zaman aşımını ve üyelik taramasını kontrol edin. Yeni önizleme açın.
- **Önizleme bitti/kullanıldı:** Beş dakika dolmuş, düğme tüketilmiş veya bot yeniden
  başlamıştır. `/groupgrove` komutunu yeniden kullanın.
- **Bekleyin/kapasite dolu:** Bir dakika sonra deneyin; tek süreç çalıştığını doğrulayın.
- **Hata aldım ama gönderi var:** Ağ sonucu belirsiz olabilir. Kanala bakın, aynı planı
  tekrar göndermeyin; gerekirse fazla gönderiyi elle silin.
- **Kurulum `.env` varken durdu:** Bilerek üzerine yazılmaz. Botu durdurup dosyayı elle
  silin ve kurulumu tekrarlayın. Tokenı GitHub'a göndermeyin.

### Testler, katkı ve lisans

`.env` olmayan temiz geliştirme kopyasında:

```sh
npm ci --ignore-scripts
npm run check
npm audit --audit-level=low
node --check scripts/setup.mjs
node --check scripts/supply.mjs
```

Kontroller: Biome önerilen lint/format kuralları, bağımlılık tipleri dahil strict
TypeScript, Node testleri, lisans/registry/SHA-512/kurulum betiği denetimi ve kaynaklarda
kimlik bilgisi örüntü taraması. Testler gerçek adaptörü taklit Discord etkileşimleriyle
çalıştırır; matematiksel küçük durumları kapsamlı sayım ile karşılaştırır, süresi dolan
taslakları, bağlam bağlamayı, yarışları, izin kaybını ve belirsiz gönderimi doğrular.
CI Linux, Windows ve macOS'ta aynı kontrolleri, Bash sözdizimi ve temiz diff kontrolünü
çalıştırır. Gerçek token kullanılmaz. Canlı kurulum, gizli token girişi, mobil/ekran
okuyucu davranışı ve sürekli barındırma ayrıca kullanıcı tarafından doğrulanmalıdır.
Örüntü taraması/audit sonuçları güvenlik garantisi değildir.

[Katkı rehberi](CONTRIBUTING.md), [güvenlik bildirimi](SECURITY.md). Kod MIT lisanslıdır;
bağımlılıkların kendi lisansları vardır. Garanti verilmez.

## English

### Purpose

GroupGrove is a **real Discord bot** that plans balanced breakout group sizes for
workshops, study sessions and community events. Enter a headcount and minimum/maximum
people per group, review a private preview, then explicitly share in the same channel.
No member names or source-code editing are needed.

Example: 23 people with 4–6 per group → **3 groups × 6 people + 1 group × 5 people**.
Choose `groups:5` for **3 groups × 5 people + 2 groups × 4 people** instead.

### Features and limits

- Native slash-command numeric fields, language selector, private Share/Discard buttons.
- 2–1000 people, minimum/maximum sizes of 2–50, optional group count of 1–500.
- Defaults to the fewest feasible groups; counts every person exactly once. Group
  sizes differ by at most one. Shows the inclusive feasible group-count range.
- Rejects impossible limits rather than silently leaving people out.
- Turkish/English output; defaults to the invoking user's Discord locale (English
  for locales other than Turkish). Manage Server permission required at every step.

It does not assign members, assess skill/fairness/accessibility, pair people, draw
lots, move voice users, change roles, track attendance, schedule, send reminders,
read messages, DM anyone or maintain a database/analytics. Agree on participation
and accessibility preferences together. One configured server and one process per
setup. Downloading or publishing this repository does not host the bot.

### Requirements

Windows/macOS/Linux, [Node.js](https://nodejs.org/en/download) **24.x ≥24.13.0** (CI uses
24.13.1), npm, internet access, a dedicated Discord application and a consenting test
server. You need Manage Server to install and use the bot. An always-on computer or
Node 24 host is required for continuous operation; GitHub Actions only tests code.
Node 22/26 are outside this release's supported range.

### Complete installation

1. Open [Discord Developer Portal](https://discord.com/developers/applications), select
   **New Application**, and copy **Application ID** from General Information.
2. Open **Bot**, create the bot if needed, and use **Reset Token** to obtain its token.
   Treat it as a password: never post it in chats, issues, screenshots or GitHub.
   Leave privileged **Presence, Server Members and Message Content intents disabled**.
3. Under **Installation**, choose **Guild Install**, scopes `bot` and
   `applications.commands`, with only **View Channels + Send Messages** (3072).
   Do not grant Administrator, Manage Roles/Members or Read Message History.
   Leave **Interactions Endpoint URL empty**; this program receives Gateway events.
4. Discord Settings → Advanced → **Developer Mode**. Right-click the server icon →
   **Copy Server ID**. Use a server ID, not a channel ID.
5. Download **Code → Download ZIP**, fully extract it, install Node.js 24 and open a
   fresh terminal. Windows: double-click `setup.cmd`. macOS/Linux: open a terminal
   in the extracted folder and run `bash setup.sh`. Enter IDs; paste the token at
   the hidden prompt and press Enter. No characters appear while entering the token.
6. Setup creates a local `.env` without overwriting an existing file. Open the
   installation link printed by setup and choose the correct server. Alternatively,
   use the Portal's Install Link with the same scopes and permissions.
7. Windows: open `register.cmd`. macOS/Linux: `bash register.sh`. This upserts only
   `/groupgrove` in the configured server; other commands are not bulk-replaced.
   An existing command with this name in the same application is updated.
8. Windows: `start.cmd`. macOS/Linux: `bash start.sh`. Wait for **GroupGrove connected**.
   Keep the terminal open. Stop with Ctrl+C.

Terminal alternative, from the extracted folder:

```sh
npm ci --ignore-scripts
npm run setup
npm run register
npm start
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` or the provided `.cmd` helpers instead
of changing execution policy. Setup needs an interactive terminal.

### Configuration

Setup writes `DISCORD_TOKEN`, `APPLICATION_ID` and `GUILD_ID` locally. No source edits
are needed. Stop the bot, delete `.env` manually and rerun setup to reconfigure.
If a token leaked, reset it in Developer Portal first; deleting a file is insufficient.
`.env.example` is an example only. New files use POSIX mode 0600; on Windows restrict
folder access to your account. Keep `.env` out of shared/synced folders and backups.
A hosting provider may supply the same three secret environment variables instead;
existing environment variables take precedence over `.env`. Check stale service settings.

### Usage

In a regular server text channel, choose `/groupgrove`. `participants` is the headcount;
`minimum`/`maximum` are people per group; optional `groups` sets an exact feasible count;
`language` selects English/Turkish. Example:
`/groupgrove participants:23 minimum:4 maximum:6 language:en`.

Review the numeric plan privately. **Share in this channel** posts one plain-text
message in the invoking channel; **Discard** consumes the draft. No pings or other
channels. Previews last five minutes and are single-use. Restart removes them.
An expired preview can remain visible in Discord for a while, but its buttons cannot
publish. Start a new command to change values or replace an expired preview.

Forms have a five-second per-member/server cooldown; sharing has a sixty-second
per-channel cooldown and an in-flight channel lock. Failed attempts can consume the
cooldown. Capacity: 100 drafts, 100 in-flight channel operations and 1000 records per
cooldown table. These limits are in RAM and reset on restart; never run replicas.

### Permissions and safety

Bot: **View Channel + Send Messages**; only the `Guilds` intent. User: **Manage Server**
plus View Channel, Send Messages and Use Application Commands in the channel.
Integration restrictions can additionally hide the command. Regular text channels
only; no threads, forums, announcement channels, DMs or voice. Slowmode must be off.
Timed-out or membership-screening-pending accounts cannot publish. Administrator on
the bot causes rejection; remove that permission and unnecessary roles.

Fresh guild, role, channel, bot and invoking-member metadata is fetched before
preview/publication. Permission changes can race the final send; Discord does not
offer an atomic multi-endpoint snapshot. REST error details are withheld. Server-error
retries are disabled and rate limits fail closed. An uncertain send may already be
visible; inspect the channel before making a new preview and trying again.

### Privacy and keeping it online

Numbers, language and draft context IDs live temporarily in RAM; no message history
is read. Discord still processes commands/messages. Private previews are not secret
from Discord or the hosting operator. Public plans persist after draft expiry/bot
removal and must be deleted manually in Discord. See [Privacy](PRIVACY.md) for SDK
caches, metadata and deletion steps, and [Security](SECURITY.md) for token handling.

The bot stops responding when the computer sleeps, terminal closes or connection
fails. For continuous service, run one process on your own Node 24 host with a service
manager: working directory is the repository folder, command is `npm start`, and
configuration belongs in secret environment variables or restricted `.env`. Never
put tokens in command-line arguments. This repository does not install remote
services or configure a VPS. Restart loses drafts and resets cooldowns.

### Troubleshooting

- **Command missing:** Check installation in the right server, run registration,
  verify scopes/IDs, Manage Server and channel/integration restrictions; refresh Discord.
- **Startup/registration failed:** Check `node --version`, network, all three settings
  and the current bot token. Never paste tokens into diagnostics or issues.
- **No feasible plan:** Three people cannot form groups of exactly two. Widen bounds
  or choose a group count in the displayed range.
- **Sharing unavailable:** Remove bot Administrator; check permissions, timeout,
  membership screening and slowmode, then create a fresh preview.
- **Expired/used preview:** Five minutes passed, the draft was consumed or the bot
  restarted. Run `/groupgrove` again.
- **Cooldown/capacity:** Wait a minute; confirm only one process is running.
- **Error but a message appeared:** Delivery was uncertain. Inspect the channel before
  retrying; remove duplicates manually if necessary.
- **Setup stops with existing `.env`:** Stop the bot, delete that file yourself and
  rerun setup. It deliberately never overwrites credentials.

### Tests, contributions and license

In a clean checkout without `.env`:

```sh
npm ci --ignore-scripts
npm run check
npm audit --audit-level=low
node --check scripts/setup.mjs
node --check scripts/supply.mjs
```

Checks include recommended Biome lint/format, strict TypeScript including dependency
types, Node tests, dependency license/registry/SHA-512/install-script checks and source
credential-pattern scans. Tests exhaustively compare small mathematical cases with
an independent enumeration and exercise the real Discord adapter with mocked
interactions, permission loss, context binding, expiry, concurrent clicks and uncertain
delivery. CI runs these checks on Linux, Windows and macOS, plus Bash helper syntax
and clean-diff checks. It uses no real token. Live installation, hidden-token entry,
mobile/screen-reader behavior and always-on hosting require operator validation.
Pattern scans and audits do not guarantee security.

See [Contributing](CONTRIBUTING.md) and [Security](SECURITY.md). MIT license; dependencies
retain their own licenses. No warranty.

### Official references / Resmî kaynaklar

- [Discord interactions](https://docs.discord.com/developers/interactions/receiving-and-responding)
- [Application commands](https://docs.discord.com/developers/interactions/application-commands)
- [Gateway intents](https://docs.discord.com/developers/events/gateway#gateway-intents)
- [Permissions](https://docs.discord.com/developers/topics/permissions)
- [Developer Policy](https://support-dev.discord.com/hc/en-us/articles/8563934450327-Discord-Developer-Policy)
