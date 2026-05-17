# AutoDiag OBD

App **React Native + Expo (SDK 52)** para Android, focado em diagnóstico OBD2/ELM327 via Bluetooth clássico (SPP).

MVP para **provar comunicação real** com o adaptador. Sem backend, sem PDF.

## Stack

- Expo SDK 52 (React Native 0.76)
- TypeScript
- React Navigation v7 (native stack)
- Zustand (estado global)
- [`react-native-bluetooth-classic`](https://github.com/kenjdavidson/react-native-bluetooth-classic) (SPP)
- **expo-dev-client** — Bluetooth clássico exige módulo nativo, então **não roda em Expo Go**. Você usa um **dev client custom** (APK gerado pelo EAS Build).

## Estrutura

```
src/
  app/navigation/        # Stack + tipos
  screens/               # Dashboard, Scanner, Terminal, Diagnostic, LiveData, ErrorDetail, Checklist
  components/            # AppCard, AppButton, StatusBadge, DtcCard, ...
  modules/
    bluetooth/           # BluetoothService (SPP)
    obd/                 # Elm327Client + parsers (DTC, PID)
    diagnostics/         # Regras (Ford EcoSport P2135)
  store/                 # Zustand: obd, vehicle
  theme/                 # colors, spacing, typography
```

## Fluxo de teste no Redmi 12 (sem Android Studio, sem JDK 17 local)

Você vai compilar o APK no servidor da Expo (EAS Build) e instalar direto no celular.

### 1) Instalar dependências locais (Mac)

```bash
npm install -g eas-cli
cd autodiag-obd
npm install
```

> Não precisa de Android SDK nem JDK local. Só Node ≥ 18 e `eas-cli`.

### 2) Criar conta + logar no Expo

```bash
npx expo login          # ou: eas login
```

Conta grátis em https://expo.dev/signup.

### 3) Configurar o projeto EAS

```bash
eas init
# Quando perguntar, escolha "create new project".
# Isso grava o projectId em app.json (substitui REPLACE_AFTER_FIRST_EAS_INIT).
```

### 4) Build do APK de desenvolvimento

```bash
eas build --platform android --profile development
```

- Roda na nuvem (~10–15 min).
- No final você recebe um **link de APK** + QR code.

### 5) Instalar no Redmi 12

Duas opções:

**a) Pelo celular** — abra o link no Chrome do Redmi, baixe o APK, autorize "Instalar fontes desconhecidas", instale.

**b) Pelo Mac via adb** (se tiver) — `adb install autodiag-obd.apk`.

### 6) Rodar Metro com hot reload

No Mac:

```bash
npx expo start --dev-client
```

Abra o app no Redmi → ele se conecta ao Metro do Mac (mesma Wi-Fi). Mudanças no código fazem reload automático.

### 7) Builds futuras

Você só precisa de novo build EAS quando mexer em código nativo, permissões, dependências nativas ou versão do SDK. Mudanças em JS/TS recarregam pelo Metro.

Para gerar o APK "final" pra alguém que não vai mexer no Metro:

```bash
eas build --platform android --profile preview
```

## Pareando o ELM327 antes de usar

O app **não escaneia** dispositivos — apenas lista pareados. Antes do primeiro uso:

1. Ligue a ignição do veículo (sem dar partida) e plugue o ELM327 na porta OBD2.
2. Em **Configurações Bluetooth do Android**, pareie com o adaptador (PIN comum: `1234` ou `0000`).
3. Abra o AutoDiag OBD → **Scanner** → o dispositivo aparece na lista → **Conectar**.

## Permissões Android

Declaradas em `app.json` em `expo.android.permissions`:

- `BLUETOOTH`, `BLUETOOTH_ADMIN`, `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` (Android ≤ 11)
- `BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN` (Android 12+)

`BluetoothService.requestPermissions()` solicita as runtime permissions adequadas pelo nível de API.

## Fluxo recomendado in-app

1. **Dashboard** → veículo ativo + status do scanner.
2. **Scanner** → permissões → conectar.
3. **Terminal OBD** → enviar `ATI` e `ATRV` para sanity check.
4. **Diagnóstico** → **Inicializar ELM327** (ATZ → ATE0 → ATL0 → ATS0 → ATH0 → ATSP0 → 0100) → **Ler códigos** (`03`).
5. **Apagar códigos** abre confirmação antes de enviar `04`.
6. **Dados ao vivo** → leitura sob demanda (`010C`, `0105`, `0111`, `010D`, `ATRV`).
7. Se P2135 aparecer → **Detalhe do erro** → **Checklist**.

## Comandos OBD disponíveis (terminal)

`ATI`, `ATRV`, `ATZ`, `ATE0`, `ATL0`, `ATS0`, `ATH0`, `ATSP0`, `0100`, `0101`, `010C`, `0105`, `0111`, `03`, `04`.

Todo comando é enviado com `\r`. Cliente espera pelo prompt `>` antes de devolver a resposta.

## Parsers implementados

| Comando | Parser |
| --- | --- |
| `ATRV` | tensão em volts (regex) |
| `010C` | RPM = (256·A + B) / 4 |
| `0105` | temp = A − 40 |
| `0111` | borboleta = A·100/255 (%) |
| `010D` | velocidade = A (km/h) |
| `03` | DTC tolerante a `43 01 21 35`, `43 21 35`, `43012135` |

## Segurança operacional

- Comando `04` (apagar códigos) **sempre** passa por modal de confirmação.
- App fala em **"apagar códigos de falha"**, nunca "resetar módulo".
- Ações OBD **bloqueadas** quando o scanner está desconectado.

## Limitações conhecidas

- **Sem polling contínuo** no Live Data (MVP — leitura sob demanda).
- **Sem persistência** de histórico (Zustand em memória).
- **Sem descoberta** de dispositivos não pareados — pareie pelo Android primeiro.
- ELM327 clones podem ter timing diferente; cliente usa polling 50ms / timeout 4s (6s para `ATZ`).
- Regras de diagnóstico **somente para EcoSport 1.6 Sigma / P2135** (extensível em `src/modules/diagnostics`).
- Android-only no MVP.

## Quando você terá que rodar `expo prebuild`

Se decidir abandonar EAS e buildar localmente, precisará:

```bash
npx expo prebuild --platform android --clean
```

Isso gera a pasta `android/` nativa. Aí precisa de JDK 17 + Android SDK localmente (caminho que evitamos com EAS).
