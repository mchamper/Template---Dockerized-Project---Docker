<x-mail::message>
# Cambio de contraseña solicitado

Haz click en el siguiente link para cambiar tu contraseña en tu cuenta:

<x-mail::button :url="$url">
Cambiar contraseña
</x-mail::button>

Si el link no funciona, copia y pega el siguiente texto en una pestaña de tu navegador:

<code style="word-wrap: break-word">
<small>{{ $url }}</small>
</code>

</x-mail::message>
