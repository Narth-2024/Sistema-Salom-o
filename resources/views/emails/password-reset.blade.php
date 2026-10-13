<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Redefina sua senha</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width:520px;background-color:#ffffff;border-radius:16px;border:1px solid #e4e4e7;padding:32px;">
                    <tr>
                        <td>
                            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6366f1;letter-spacing:0.02em;">SISTEMA SALOMÃO</p>
                            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#18181b;">Olá, {{ $name }}</h1>
                            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">
                                Recebemos um pedido para redefinir a senha da sua conta. Para escolher uma nova senha,
                                clique no botão abaixo:
                            </p>

                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                                <tr>
                                    <td style="border-radius:10px;background-color:#6366f1;">
                                        <a href="{{ $resetUrl }}"
                                           style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                                            Redefinir minha senha
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#71717a;">
                                O link expira em <strong>60 minutos</strong> e só pode ser usado uma única vez.
                            </p>
                            <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
                                Se o botão não funcionar, copie e cole este endereço no navegador:
                            </p>
                            <p style="margin:8px 0 0;font-size:12px;line-height:1.6;word-break:break-all;">
                                <a href="{{ $resetUrl }}" style="color:#6366f1;">{{ $resetUrl }}</a>
                            </p>
                        </td>
                    </tr>
                </table>

                <p style="max-width:520px;margin:16px 0 0;font-size:12px;line-height:1.6;color:#a1a1aa;">
                    Se você não pediu essa alteração, pode ignorar este email. Ninguém conseguirá redefinir sua
                    senha sem este link.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
