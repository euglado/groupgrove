# Privacy / Gizlilik

GroupGrove receives slash-command numbers, language choice and Discord interaction
metadata (user, server, channel and message IDs). Numeric drafts and their owner/context
IDs are kept in RAM for at most five minutes, with a thirty-second cleanup interval.
They expire at five minutes on access and are consumed by share/discard. Restarting
removes drafts. Form cooldowns last five seconds; share cooldowns last sixty seconds.
In-flight channel locks last until an operation finishes. These tables are bounded.
Discord.js also caches server roles/channels and up to 100 members plus the bot per
server; it does not cache messages here. Cache data disappears when the process stops.

There is no database, telemetry, history reader, attendance list, direct messaging,
external analytics or personal assignment. Discord still processes command input,
ephemeral previews and public messages under its own policies. Ephemeral means hidden
from other ordinary members, not encrypted from Discord or the hosting operator.
Published numeric plans remain in Discord until a human deletes them; RAM expiry and
bot removal do not delete public posts. The bot does not automatically clean up posts.
Operator logs contain fixed status/error text, not command values or REST exception
details. The hosting provider and Discord may retain their own metadata.

For deletion: discard previews or wait five minutes, stop the process to clear caches,
and manually delete public plans in Discord. Remove the application from the server
and delete the local `.env` when retiring it. Revoke/reset the token in Developer
Portal. Delete backups containing `.env` as appropriate for your host.

Türkçe: Bot sayısal komutları, dil seçimini ve Discord etkileşim kimliklerini alır.
Önizlemeler ve bağlam kimlikleri RAM'de beş dakika tutulur; otuz saniyede bir temizlik
yapılır, erişimde beşinci dakikada hemen geçersizleşir. Paylaşma/vazgeçme taslağı
tüketir. Yeniden başlatma taslakları siler. Komut bekleme süresi beş saniye, kanal
paylaşım bekleme süresi altmış saniyedir. Devam eden kanal kilidi işlem bitene kadar
tutulur. Tablolar sınırlıdır. SDK sunucu rol/kanal bilgisini ve sunucu başına en çok
100 üyeyi ve botu önbelleğe alır; mesajları önbelleğe almaz. Süreç kapanınca silinir.

Veritabanı, analiz, katılım listesi, özel mesaj ve geçmiş taraması yoktur. Discord
komutları ve mesajları kendi politikalarıyla işler. Özel önizleme diğer sıradan
üyelerden gizlidir; Discord veya barındırma yöneticisinden şifrelenmiş değildir.
Paylaşılan planları insanın elle silmesi gerekir; taslak süresi veya botu kaldırma
gönderileri silmez. Uygulama logları sabit durum/hata metni içerir; komut değerlerini
ve REST hata ayrıntılarını yazmaz. Platform/barındırma kendi metaverilerini tutabilir.

Silme için önizlemeden vazgeçin veya beş dakika bekleyin; önbellek için süreci durdurun,
public gönderileri Discord'da elle silin. Kullanımdan kaldırırken uygulamayı sunucudan
çıkarın, yerel `.env` ve ilgili yedeklerini silin, Developer Portal'da tokenı yenileyin.
