<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validación del idioma
    |--------------------------------------------------------------------------
    |
    | Las siguientes líneas de idioma contienen los mensajes de error predeterminados utilizados por
    | La clase validadora. Algunas de estas reglas tienen múltiples versiones tales
    | como las reglas de tamaño. Siéntase libre de modificar cada uno de estos mensajes aquí.
    |
    */

    'accepted' => 'Este campo debe ser aceptado.',
    'accepted_if' => 'Este campo debe ser aceptado cuando :other es :value.',
    'active_url' => 'Este campo no es una URL válida.',
    'after' => 'Este campo debe ser una fecha después de :date.',
    'after_or_equal' => 'Este campo debe ser una fecha después o igual a :date.',
    'alpha' => 'Este campo sólo puede contener letras.',
    'alpha_dash' => 'Este campo sólo puede contener letras, números y guiones.',
    'alpha_num' => 'Este campo sólo puede contener letras y números.',
    'array' => 'Este campo debe ser un arreglo.',
    'ascii' => 'Este campo solo debe contener símbolos y caracteres alfanuméricos de un solo byte.',
    'before' => 'Este campo debe ser una fecha antes de :date.',
    'before_or_equal' => 'Este campo debe ser una fecha antes o igual a :date.',
    'between' => [
        'numeric' => 'Este campo debe estar entre :min - :max.',
        'file' => 'Este campo debe estar entre :min - :max kilobytes.',
        'string' => 'Este campo debe estar entre :min - :max caracteres.',
        'array' => 'Este campo debe tener entre :min y :max elementos.',
    ],
    'boolean' => 'Este campo debe ser verdadero o falso.',
    'confirmed' => 'La opción de confirmación de este campo no coincide.',
    'current_password' => 'La contraseña actual no es correcta',
    'date' => 'Este campo no es una fecha válida.',
    'date_equals' => 'Este campo debe ser una fecha igual a :date.',
    'date_format' => 'Este campo no corresponde con el formato :format.',
    'decimal' => 'Este campo debe tener :decimal decimales.',
    'declined' => 'Este campo debe marcar como rechazado.',
    'declined_if' => 'Este campo debe marcar como rechazado cuando :other es :value.',
    'different' => 'Los campos :attribute y :other deben ser diferentes.',
    'digits' => 'Este campo debe ser de :digits dígitos.',
    'digits_between' => 'Este campo debe tener entre :min y :max dígitos.',
    'dimensions' => 'Este campo no tiene una dimensión válida.',
    'distinct' => 'Este campo tiene un valor duplicado.',
    'doesnt_end_with' => 'Este campo no puede finalizar con uno de los siguientes valores: :values.',
    'doesnt_start_with' => 'Este campo no puede comenzar con uno de los siguientes valores: :values.',
    'email' => 'El formato de este campo no es válido.',
    'ends_with' => 'Este campo debe terminar con alguno de los valores: :values.',
    'enum' => 'La opción seleccionada en este campo no es válida.',
    'exists' => 'Este campo seleccionado no es válido.',
    'model_exists' => 'Este campo seleccionado no es válido.',
    'file' => 'Este campo debe ser un archivo.',
    'filled' => 'Este campo es requerido.',
    'gt' => [
        'numeric' => 'Este campo debe ser mayor que :value.',
        'file' => 'Este campo debe ser mayor que :value kilobytes.',
        'string' => 'Este campo debe ser mayor que :value caracteres.',
        'array' => 'Este campo puede tener hasta :value elementos.',
    ],
    'gte' => [
        'numeric' => 'Este campo debe ser mayor o igual que :value.',
        'file' => 'Este campo debe ser mayor o igual que :value kilobytes.',
        'string' => 'Este campo debe ser mayor o igual que :value caracteres.',
        'array' => 'Este campo puede tener :value elementos o más.',
    ],
    'image' => 'Este campo debe ser una imagen.',
    'in' => 'Este campo seleccionado no es válido.',
    'in_array' => 'Este campo no existe en :other.',
    'integer' => 'Este campo debe ser un entero.',
    'ip' => 'Este campo debe ser una dirección IP válida.',
    'ipv4' => 'Este campo debe ser una dirección IPv4 válida.',
    'ipv6' => 'Este campo debe ser una dirección IPv6 válida.',
    'json' => 'Este campo debe ser una cadena JSON válida.',
    'lowercase' => 'Este campo debe ser minúsculas.',
    'lt' => [
        'numeric' => 'Este campo debe ser menor que :max.',
        'file' => 'Este campo debe ser menor que :max kilobytes.',
        'string' => 'Este campo debe ser menor que :max caracteres.',
        'array' => 'Este campo puede tener hasta :max elementos.',
    ],
    'lte' => [
        'numeric' => 'Este campo debe ser menor o igual que :max.',
        'file' => 'Este campo debe ser menor o igual que :max kilobytes.',
        'string' => 'Este campo debe ser menor o igual que :max caracteres.',
        'array' => 'Este campo no puede tener más que :max elementos.',
    ],
    'mac_address' => 'Este campo debe ser una dirección MAC válida.',
    'max' => [
        'numeric' => 'Este campo debe ser menor que :max.',
        'file' => 'Este campo debe ser menor que :max kilobytes.',
        'string' => 'Este campo debe ser menor que :max caracteres.',
        'array' => 'Este campo puede tener hasta :max elementos.',
    ],
    'max_digits' => 'Este campo no puede superar los :max dígitos.',
    'mimes' => 'Este campo debe ser un archivo de tipo: :values.',
    'mimetypes' => 'Este campo debe ser un archivo de tipo: :values.',
    'min' => [
        'numeric' => 'Este campo debe tener al menos :min.',
        'file' => 'Este campo debe tener al menos :min kilobytes.',
        'string' => 'Este campo debe tener al menos :min caracteres.',
        'array' => 'Este campo debe tener al menos :min elementos.',
    ],
    'min_digits' => 'Este campo debe ser como mínimo de :min dígitos.',
    'missing' => 'Este campo debe faltar.',
    'missing_if' => 'Este campo debe faltar cuando :other es :value',
    'missing_unless' => 'Este campo debe faltar a menos que :other sea :value.',
    'missing_with' => 'Este campo debe faltar cuando :values está presente.',
    'missing_with_all' => 'Este campo debe faltar cuando :values están presentes',
    'multiple_of' => 'Este campo debe ser un múltiplo de :value.',
    'not_in' => 'Este campo seleccionado es invalido.',
    'not_regex' => 'El formato de este campo no es válido.',
    'numeric' => 'Este campo debe ser un número.',
    'password' => [
        'letters' => 'Este campo debe contener al menos una letra.',
        'mixed' => 'Este campo debe contener al menos una letra mayúscula y una minúscula.',
        'numbers' => 'Este campo debe contener al menos un número.',
        'symbols' => 'Este campo debe contener al menos un símbolo.',
        'uncompromised' => 'El valor de este campo aparece en alguna filtración de datos. Por favor indica un valor diferente.',
    ],
    'present' => 'Este campo debe estar presente.',
    'prohibited' => 'Este campo no está permitido.',
    'prohibited_if' => 'Este campo no está permitido cuando :other es :value.',
    'prohibited_unless' => 'Este campo no está permitido si :other no está en :values.',
    'prohibits' => 'Este campo no permite que :other esté presente.',
    'regex' => 'El formato de este campo no es válido.',
    'required' => 'Este campo es requerido.',
    'required_array_keys' => 'Este campo debe contener entradas para: :values.',
    'required_if' => 'Este campo es requerido cuando el campo :other es :value.',
    'required_unless' => 'Este campo es requerido a menos que :other esté presente en :values.',
    'required_with' => 'Este campo es requerido cuando :values está presente.',
    'required_with_all' => 'Este campo es requerido cuando :values está presente.',
    'required_without' => 'Este campo es requerido cuando :values no está presente.',
    'required_without_all' => 'Este campo es requerido cuando ningún :values está presente.',
    'same' => 'Este campo y :other debe coincidir.',
    'size' => [
        'numeric' => 'Este campo debe ser :size.',
        'file' => 'Este campo debe tener :size kilobytes.',
        'string' => 'Este campo debe tener :size caracteres.',
        'array' => 'Este campo debe contener :size elementos.',
    ],
    'starts_with' => 'Este campo debe empezar con uno de los siguientes valores :values',
    'string' => 'Este campo debe ser una cadena.',
    'timezone' => 'Este campo debe ser una zona válida.',
    'unique' => 'Este campo ya ha sido tomado.',
    'uploaded' => 'Este campo no ha podido ser cargado.',
    'uppercase' => 'Este campo debe estar en mayúsculas',
    'url' => 'El formato de este campo no es válido.',
    'ulid' => 'Este campo debe ser un ULID valido.',
    'uuid' => 'Este campo debe ser un UUID valido.',

    'password.mixed' => 'Este campo debe contener al menos una letra mayúscula y una minúscula.',
    'password.letters' => 'Este campo debe contener al menos una letra.',
    'password.symbols' => 'Este campo debe contener al menos un símbolo.',
    'password.numbers' => 'Este campo debe contener al menos un número.',
    'password.uncompromised' => 'El atributo :attribute ha aparecido en una fuga de datos. Elija un :attribute diferente.',

    /*
    |--------------------------------------------------------------------------
    | Validación del idioma personalizado
    |--------------------------------------------------------------------------
    |
    | Aquí puede especificar mensajes de validación personalizados para atributos utilizando el
    | convención "attribute.rule" para nombrar las líneas. Esto hace que sea rápido
    | especifique una línea de idioma personalizada específica para una regla de atributo dada.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Atributos de validación personalizados
    |--------------------------------------------------------------------------
    |
    | Las siguientes líneas de idioma se utilizan para intercambiar los marcadores de posición de atributo.
    | con algo más fácil de leer, como la dirección de correo electrónico.
    | de "email". Esto simplemente nos ayuda a hacer los mensajes un poco más limpios.
    |
    */

    'attributes' => [],

];
