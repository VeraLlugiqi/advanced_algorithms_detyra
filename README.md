# Ndryshimet dhe Udhëzimet për TV Channel Scheduling Instance Generator


###  . Gjenerim Automatik i Instancave

**Funksionaliteti:**
-  Krijon automatikisht numrin e specifikuar të kanaleve
-  Për çdo kanal krijon programe me:
  - Kohë fillimi dhe mbarimi brenda intervalit të lejuar
  - Pa mbivendosje brenda të njëjtit kanal
  - Zhanër (genre) të caktuar
  - Score brenda intervalit min/max të specifikuar
  - Respekton min/max duration
-  Merr parasysh priority blocks dhe time preferences (ose i gjeneron automatikisht nëse nuk janë të specifikuara)

###  4. Prodhimi i File JSON
- JSON-i prodhohet në formatin e duhur me fushat:
  - `opening_time`, `closing_time`
  - `channels` (me `channel_id`, `channel_name`, `programs`)
  - `programs` (me `program_id`, `start`, `end`, `genre`, `score`)
  - `priority_blocks` (nëse janë të specifikuara)
  - `time_preferences` (nëse janë të specifikuara)
  - Të gjitha parametrat e tjerë

###  5. Butoni "Download JSON file"
- Butoni "Download JSON file" është shtuar pranë butonit "Copy JSON"
- Kur klikohet:
  - Gjeneron instancën në memorie sipas parametrave
  - Transformon të dhënat në formatin e duhur
  - Shkarkon file-in si `kosovo_tv_input_generated.json`

###  6. Pamja Vizuale
- Struktura e ngjashme me gjeneratorin e "Traffic Signaling"
- Panel me parametra në anën e majtë
- Preview i JSON në anën e djathtë
- Komponente të organizuara dhe moderne

## Ndryshimet e Bëra në Kod

### 1. `src/pages/Index.tsx`
-  Shtuar `max_duration`, `min_score`, `max_score` në schema
-  Përditësuar default values
-  Shtuar butonin "Download JSON file"
-  Përditësuar titullin e aplikacionit
-  Importuar `generateSchedule` dhe `Download` icon

### 2. `src/components/BasicSettings.tsx`
-  Shtuar slider për `opening_time` dhe `closing_time`
-  Shtuar slider për `max_duration`, `min_score`, `max_score`
-  Hequr input fields për opening/closing time (tani vetëm slider)
-  Përmirësuar butonin "Generate Instance"

### 3. `src/components/TimePreference.tsx`
-  **KORRIGJUAR**: Format i ri që përputhet me specifikimin:
  - `start` (në minuta) në vend të `day` dhe `start_time`
  - `end` (në minuta) në vend të `end_time`
  - `preferred_genre` (dropdown me zhanre)
  - `bonus` (numër) në vend të `priority`

### 4. `src/lib/generate.ts`
-  Shtuar `max_duration`, `min_score`, `max_score` në interface `Config`
-  Përmirësuar `generateSchedule` për të:
  - Përdorur `max_duration` për kufizimin e kohëzgjatjes së programeve
  - Përdorur `min_score` dhe `max_score` për score të programeve
  - Respektuar kufizimin e `max_consecutive_genre`
  - Përdorur priority blocks dhe time preferences të përdoruesit (nëse janë të specifikuara)
  - Gjeneruar programe pa mbivendosje dhe brenda kufijve të specifikuar

### 5. `index.html`
-  Përditësuar titulli i faqes

### Hapat për Ekzekutim

1. **Hap terminalin dhe shko në direktorinë e projektit:**
   ```bash
   cd advanced_algorithms_detyra/generation-page
   ```

2. **Nis serverin e zhvillimit:**
 
   Ose:
   ```bash
   npm run dev
   ```

4. **Hap browserin:**
   - Aplikacioni do të hapet automatikisht në `http://localhost:5173` (ose port tjetër që Vite zgjedh)
   - Nëse nuk hapet automatikisht, shko manualisht në URL-në që shfaqet në terminal

5. **Përdor aplikacionin:**
   - Ndrysho parametrat duke përdorur slider-at
   - Shto Time Preferences dhe Priority Blocks nëse dëshiron
   - Kliko "Generate Instance" për të parë preview
   - Kliko "Download JSON file" për të shkarkuar file-in JSON

## Format i JSON Output

JSON-i i gjeneruar ka këtë strukturë:

```json
{
  "opening_time": 0,
  "closing_time": 630,
  "min_duration": 30,
  "max_duration": 120,
  "min_score": 10,
  "max_score": 100,
  "max_consecutive_genre": 2,
  "channels_count": 24,
  "switch_penalty": 5,
  "termination_penalty": 10,
  "priority_blocks": [
    {
      "start": 100,
      "end": 200,
      "allowed_channels": [0, 1, 2]
    }
  ],
  "time_preferences": [
    {
      "start": 0,
      "end": 60,
      "preferred_genre": "news",
      "bonus": 10
    }
  ],
  "channels": [
    {
      "channel_id": 0,
      "channel_name": "Channel_0",
      "programs": [
        {
          "program_id": "channel_0_program_1",
          "start": 0,
          "end": 45,
          "genre": "news",
          "score": 75
        },
        ...
      ]
    },
    ...
  ]
}
```
