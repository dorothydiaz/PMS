<?php
$file = 'assets/js/pages/directives.js';
$scriptJs = file_get_contents('assets/js/script.js');
$content = file_get_contents($file);

preg_match_all('/([a-zA-Z0-9_$]+)\s*\(/', $content, $matches);
$calls = array_unique($matches[1]);

$builtins = [
    'function', 'if', 'else', 'for', 'forEach', 'map', 'filter', 'sort', 'reduce', 
    'push', 'slice', 'splice', 'includes', 'join', 'split', 'trim', 'toLowerCase', 
    'toUpperCase', 'toString', 'replace', 'substr', 'substring', 'charAt', 'indexOf',
    'find', 'findIndex', 'some', 'every', 'catch', 'then', 'switch', 'case', 'return',
    'while', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'Math', 'Date', 'String',
    'Number', 'Boolean', 'Array', 'Object', 'JSON', 'RegExp', 'encodeURIComponent',
    'decodeURIComponent', 'console', 'setTimeout', 'clearTimeout', 'setInterval',
    'clearInterval', 'alert', 'confirm', 'prompt', 'fetch', 'localStorage', 'sessionStorage',
    'document', 'window', 'addEventListener', 'removeEventListener', 'querySelector',
    'querySelectorAll', 'getElementById', 'getElementsByClassName', 'createElement',
    'appendChild', 'removeChild', 'insertBefore', 'setAttribute', 'getAttribute',
    'removeAttribute', 'classList', 'add', 'remove', 'toggle', 'contains', 'focus',
    'blur', 'click', 'scrollIntoView', 'reset', 'submit', 'hasAttribute', 'entries',
    'keys', 'values', 'assign', 'localeCompare', 'match', 'test', 'exec', 'isArray',
    'toLocaleString', 'padStart', 'padEnd', 'round', 'min', 'max', 'floor', 'ceil',
    'abs', 'log', 'warn', 'error', 'info', 'table', 'getItem', 'setItem', 'removeItem',
    'clear', 'stopImmediatePropagation', 'stopPropagation', 'preventDefault', 'bind',
    'startsWith', 'endsWith', 'getBBox', 'cloneNode'
];

echo "Undeclared calls in $file:\n";
foreach ($calls as $fn) {
    if (in_array($fn, $builtins)) continue;
    $definedInFile = (strpos($content, "function $fn") !== false) || 
                     (strpos($content, "const $fn") !== false) || 
                     (strpos($content, "let $fn") !== false) || 
                     (strpos($content, "var $fn") !== false) ||
                     (strpos($content, "$fn =") !== false);
    if (!$definedInFile) {
        $inScriptJs = (strpos($scriptJs, "function $fn") !== false);
        echo sprintf("  %-30s (In script.js: %d)\n", $fn, $inScriptJs);
    }
}

