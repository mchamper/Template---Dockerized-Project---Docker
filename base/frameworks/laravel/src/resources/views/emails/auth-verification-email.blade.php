<x-mail::message>
# ¡Bienvenido!

Haz click en el siguiente link para verificar tu dirección de correo y comenzar a usar todos los servicios de tu nueva cuenta:

<x-mail::button :url="$url">
Verificar cuenta
</x-mail::button>

Si el link no funciona, copia y pega el siguiente texto en una pestaña de tu navegador:

<code style="word-wrap: break-word">
<small>{{ $url }}</small>
</code>

</x-mail::message>
