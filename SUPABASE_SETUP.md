# Configuração do Supabase no Laravel

## Passo 1: Criar projeto no Supabase Cloud

1. Acesse https://supabase.com
2. Faça login com GitHub, Google ou email
3. Clique em **"New Project"**
4. Preencha as informações:
   - **Name**: `app-salomao`
   - **Database Password**: (guarde esta senha!)
   - **Region**: `South America (Brazil)` ou mais próxima

## Passo 2: Conectar extensão do VSCode

1. No VSCode, abra a paleta de comandos (`Ctrl+Shift+P`)
2. Digite **"Supabase: Link Project"**
3. Faça login no Supabase se necessário
4. Selecione o projeto que você criou

## Passo 3: Obter credenciais da API

No dashboard do Supabase:

1. Vá em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie as seguintes informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: (para uso no frontend)
   - **service_role key**: (para o backend - **MANTENHA SECRETA!**)

## Passo 4: Configurar variáveis de ambiente

Edite o arquivo `.env` do seu projeto:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_KEY=sua-chave-service-role-aqui
```

## Passo 5: Configurar banco de dados no Supabase

No dashboard do Supabase:

1. Vá em **Table Editor**
2. Crie suas tabelas conforme necessidade
3. Ou use o **SQL Editor** para rodar migrations

Exemplo de tabela simples:

```sql
CREATE TABLE clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Passo 6: Configurar Row Level Security (RLS)

No Supabase, vá em **Authentication** → **Policies**:

1. Para desenvolvimento inicial, você pode desabilitar RLS temporariamente
2. Ou crie policies para permitir acesso:

```sql
-- Permitir leitura para usuários autenticados
CREATE POLICY "Leitura para autenticados" ON clientes
  FOR SELECT TO authenticated USING (true);

-- Permitir inserção para usuários autenticados
CREATE POLICY "Inserção para autenticados" ON clientes
  FOR INSERT TO authenticated WITH CHECK (true);
```

## Uso no Código Laravel

O serviço do Supabase está disponível via injeção de dependência:

```php
use App\Services\SupabaseService;

class MeuController extends Controller
{
    protected SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    public function index()
    {
        // Buscar dados
        $clientes = $this->supabase->from('clientes')
            ->select('*')
            ->execute();

        return response()->json($clientes->data);
    }
}
```

## Exemplo de Controller

Veja `app/Http/Controllers/SupabaseExampleController.php` para exemplos completos de:
- Listar registros
- Inserir dados
- Autenticação
- Upload de arquivos

## Comandos Úteis

```bash
# Se tiver a CLI do Supabase instalada
supabase login       # Fazer login
supabase link        # Linkar projeto
supabase db pull     # Puxar schema do banco
supabase gen types   # Gerar tipos TypeScript
```

## Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase PHP Client](https://github.com/supabase-community/supabase-php)
- [Extensão VSCode](https://marketplace.visualstudio.com/items?itemName=supabase.vscode-supabase)
