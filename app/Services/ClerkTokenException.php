<?php

namespace App\Services;

use RuntimeException;

/**
 * Erro de domínio para token do Clerk rejeitado. Fica separado de RuntimeException
 * genérica para o controller distinguir "token inválido" de falha de infraestrutura.
 */
class ClerkTokenException extends RuntimeException {}
