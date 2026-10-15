# Security / Güvenlik

Do not post tokens, `.env`, personal data or raw HTTP logs in issues. To report a
security issue, use the repository's private vulnerability reporting feature if
available. If unavailable, open a minimal issue asking for a private reporting
channel without exploit details or credentials. No response time is promised.
Only the current main branch is maintained.

Give the bot View Channel and Send Messages only. Do not grant Administrator;
the bot refuses publication if its guild permissions include Administrator.
Use a dedicated application, a restricted host account and one process per setup.
Install only in the configured server. No privileged Gateway intents are needed.
Permission checks fetch fresh guild, roles, channel, bot and invoking member before
preview and before publication. Discord permission changes can still race the final
send; no multi-endpoint atomic permission snapshot exists. HTTP permission denial
fails safely. Discord REST server-error retries are disabled; rate limits fail closed.

Drafts bind owner/server/channel/private-message, expire in five minutes and are
consumed before network requests. Per-member form and per-channel publication
cooldowns plus bounded tables limit accidental bursts. They are process-local and
reset at restart; do not run replicas. Nonce deduplication helps uncertain delivery,
but cannot guarantee exactly-once delivery. Inspect the channel before retrying a
failed send. Public plans contain only bounded integers and fixed text; mentions
and embeds are suppressed. No code execution or URL retrieval from Discord input.

If a token leaks: stop the process, reset token in Developer Portal, remove `.env`,
rerun setup, review channel posts and logs, and remove it from Git history/backups.
Deleting one commit does not revoke a token. Gitignore/pattern scans are defenses,
not proof of absence of secrets. Review dependency updates and retain the lockfile.

Türkçe: Token, `.env`, kişisel veri veya ham HTTP logunu issue'ya koymayın. Varsa
GitHub özel güvenlik bildirimi kullanın; yoksa ayrıntı/sır vermeden özel iletişim
kanalı isteyen kısa issue açın. Yanıt süresi garantisi yoktur. Güncel main desteklenir.
Bot yalnızca Kanalı Görüntüle ve Mesaj Gönder ister; Yönetici verilirse paylaşımı
reddeder. Ayrı uygulama, sınırlı işletim sistemi hesabı ve tek süreç kullanın.
Sunucu/rol/kanal/üye/bot kontrolleri güncellenir, fakat son HTTP gönderimi ile izin
değişikliği yarışabilir. REST hatalarında otomatik yeniden gönderim yapılmaz;
belirsiz sonuçta tekrar denemeden kanalı inceleyin. Bekleme süreleri yeniden başlatmada
sıfırlanır, kopya süreç çalıştırmayın. Token sızarsa botu durdurun, Portal'da tokenı
yenileyin, `.env` dosyasını yeniden kurun ve geçmiş/yedekleri inceleyin. Commit silmek
tokenı iptal etmez. İmza taraması sır bulunmadığının garantisi değildir.
