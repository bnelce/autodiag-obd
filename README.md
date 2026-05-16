# AutoDiag OBD

App React Native (Android) para diagnóstico automotivo via scanner OBD2/ELM327 Bluetooth clássico (SPP).

MVP focado em **provar comunicação real** com o adaptador. Sem backend, sem PDF.

## Stack

- React Native 0.76 (CLI, **não** Expo Go)
- TypeScript
- React Navigation (native stack)
- Zustand (estado global)
- [`react-native-bluetooth-classic`](https://github.com/kenjdavidson/react-native-bluetooth-classic) (Bluetooth SPP)

Bluetooth clássico exige módulo nativo → use **React Native CLI** ou **Expo Dev Client**. Não roda em Expo Go puro.

## Estrutura

```
src/
  app/navigation/        # Stack navigator + tipos
  screens/               # Telas (Dashboard, Scanner, Terminal, ...)
  components/            # AppCard, AppButton, StatusBadge, ...
  modules/
    bluetooth/           # Serviço SPP (Permissões, conectar, enviar, ler)
    obd/                 # Cliente ELM327, parsers (DTC, PID)
    diagnostics/         # Regras (Ford EcoSport: P2135)
  store/                 # Zustand: obd.store, vehicle.store
  theme/                 # colors, spacing, typography
```

## Setup

> Pré-requisitos: Node ≥ 18, JDK 17, Android SDK + Platform Tools, ANDROID_HOME definido. Veja https://reactnative.dev/docs/environment-setup → "React Native CLI Quickstart".

Este pacote contém **somente** o código de aplicação (`src/`, `App.tsx`, `index.js`) e o `AndroidManifest.xml` com as permissões. A pasta `android/` nativa precisa ser gerada uma vez:

```bash
# 1) Gere um esqueleto RN com o mesmo nome
npx @react-native-community/cli@latest init AutoDiagOBD --version 0.76.3 --skip-install

# 2) Copie os arquivos deste projeto por cima do esqueleto:
#    - App.tsx, index.js, app.json, package.json, tsconfig.json
#    - src/, babel.config.js, metro.config.js
#    - Substitua android/app/src/main/AndroidManifest.xml pelo nosso

# 3) Instale dependências
yarn        # ou npm install

# 4) (Apenas para libs nativas) Linkagem é automática no autolinking do RN 0.76+

# 5) Conecte o Redmi 12 via USB com depuração ativa
adb devices

# 6) Rode em modo debug
npx react-native run-android
```

### Rodando no Redmi 12

1. Em **Configurações → Sobre o telefone** toque 7x na versão MIUI para liberar **Opções do desenvolvedor**.
2. Em **Opções do desenvolvedor** ative **Depuração USB** e **Instalar via USB**.
3. Conecte o cabo, autorize a chave RSA no telefone.
4. `adb devices` deve listar o aparelho.
5. `npx react-native run-android` → o APK debug é instalado e o Metro inicia.

Se o Metro não conectar pelo USB, rode `adb reverse tcp:8081 tcp:8081`.

## Permissões Android

O `AndroidManifest.xml` declara:

- `BLUETOOTH`, `BLUETOOTH_ADMIN`, `ACCESS_FINE_LOCATION` (Android ≤ 11)
- `BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN` (Android 12+)

`BluetoothService.requestPermissions()` solicita as runtime permissions adequadas pelo nível de API.

## Pareando o ELM327 antes de usar

O app **não escaneia** dispositivos — apenas lista pareados. Antes do primeiro uso:

1. Ligue a ignição do veículo (sem dar partida) e plugue o ELM327 na porta OBD2.
2. Em **Configurações Bluetooth do Android**, pareie com o adaptador (PIN comum: `1234` ou `0000`).
3. Abra o AutoDiag OBD → **Scanner** → o dispositivo aparece na lista → **Conectar**.

## Fluxo recomendado

1. **Dashboard** → veículo ativo + status do scanner.
2. **Scanner** → permissões → conectar.
3. **Terminal OBD** → enviar `ATI` e `ATRV` para sanity check.
4. **Diagnóstico** → **Inicializar ELM327** (ATZ → ATE0 → ATL0 → ATS0 → ATH0 → ATSP0 → 0100) → **Ler códigos** (`03`).
5. **Apagar códigos** abre confirmação antes de enviar `04`.
6. **Dados ao vivo** → leitura sob demanda (`010C`, `0105`, `0111`, `010D`, `ATRV`).
7. Se P2135 aparecer → **Detalhe do erro** → **Checklist**.

## Comandos OBD disponíveis (terminal)

`ATI`, `ATRV`, `ATZ`, `ATE0`, `ATL0`, `ATS0`, `ATH0`, `ATSP0`, `0100`, `0101`, `010C`, `0105`, `0111`, `03`, `04`.

Todo comando é enviado com `\r` (terminator do ELM327). O cliente espera pelo prompt `>` antes de devolver a resposta.

## Parsers implementados

| Comando | Parser |
| --- | --- |
| `ATRV` | tensão em volts (regex) |
| `010C` | RPM = (256·A + B) / 4 |
| `0105` | temp = A − 40 |
| `0111` | borboleta = A·100/255 (%) |
| `010D` | velocidade = A (km/h) |
| `03` | DTC parser tolerante a "43 01 21 35", "43 21 35", "43012135" |

DTC parser cobre o caso real do EcoSport e é capaz de identificar **P2135** automaticamente.

## Segurança operacional

- Comando `04` (apagar códigos) **sempre** passa por modal de confirmação com aviso explícito.
- Em nenhum momento o app fala em "resetar módulo" — apenas **apagar códigos de falha**.
- Ações OBD ficam **bloqueadas** quando o scanner está desconectado.

## Limitações conhecidas

- **Sem polling contínuo** no Live Data (MVP — leitura sob demanda).
- **Sem persistência** de histórico (Zustand em memória).
- **Sem descoberta** de dispositivos não pareados — pareie pelo Android primeiro.
- ELM327 **clones** podem ter timing diferente; o cliente usa polling de 50ms com timeout de 4s (6s para `ATZ`).
- Regras de diagnóstico **somente para Ford EcoSport 1.6 Sigma / código P2135** (extensível em `src/modules/diagnostics`).
- App **somente Android** no MVP.

## Próximos passos sugeridos

- Polling no Live Data (gráficos).
- Persistência de leituras (SQLite).
- Suporte a mais DTCs e veículos.
- Modo "tela escura" para uso na oficina (já é tema escuro, mas dá pra escurecer mais).
