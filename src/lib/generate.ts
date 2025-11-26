// ==============================
// TYPES
// ==============================

export interface PriorityBlock {
  start: number;
  end: number;
  allowed_channels: number[];
}

export interface TimePreference {
  start: number;
  end: number;
  preferred_genre: string;
  bonus: number;
}

export interface Program {
  program_id: string;
  start: number;
  end: number;
  genre: string;
  score: number;
}

export interface Channel {
  channel_id: number;
  channel_name: string;
  programs: Program[];
}

export interface Config {
  opening_time: number;
  closing_time: number;
  min_duration: number;
  max_duration: number;
  min_score: number;
  max_score: number;
  max_consecutive_genre: number;
  channels_count: number;
  switch_penalty: number;
  termination_penalty: number;
  priority_blocks?: PriorityBlock[];
  time_preferences?: TimePreference[];
  channels?: Channel[];
}

export function generateSchedule(config: Config): Config {
  const {
    opening_time,
    closing_time,
    min_duration,
    max_duration,
    min_score,
    max_score,
    max_consecutive_genre,
    channels_count,
    switch_penalty,
    termination_penalty,
    priority_blocks: userPriorityBlocks,
    time_preferences: userTimePreferences,
  } = config;

  const GENRES = [
    "news",
    "sports",
    "music",
    "movie",
    "movies",
    "kids",
    "documentary",
    "drama",
    "talk",
    "entertainment",
  ];

  const rand = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const pickGenre = () => GENRES[rand(0, GENRES.length - 1)];

  // Use user-provided priority blocks or generate them
  const priority_blocks: PriorityBlock[] = userPriorityBlocks && userPriorityBlocks.length > 0
    ? userPriorityBlocks.map((block: any) => ({
        start: block.start,
        end: block.end,
        allowed_channels: block.allowed_channels,
      }))
    : Array.from({
        length: rand(1, 3),
      }).map(() => {
        const start = rand(opening_time, closing_time - min_duration);
        const end = rand(start + min_duration, closing_time);

        return {
          start,
          end,
          allowed_channels: Array.from({ length: rand(1, 4) }).map(() =>
            rand(0, channels_count - 1)
          ),
        };
      });

  // Use user-provided time preferences or generate them
  const time_preferences: TimePreference[] = userTimePreferences && userTimePreferences.length > 0
    ? userTimePreferences.map((pref: any) => ({
        start: pref.start,
        end: pref.end,
        preferred_genre: pref.preferred_genre,
        bonus: pref.bonus,
      }))
    : Array.from({
        length: rand(1, 3),
      }).map(() => {
        const start = rand(opening_time, closing_time - min_duration);
        const end = rand(start + min_duration, closing_time);

        return {
          start,
          end,
          preferred_genre: pickGenre(),
          bonus: rand(10, 50),
        };
      });

  // Use user-provided channels or generate automatically
  let channels: Channel[] = [];
  
  if (config.channels && config.channels.length > 0) {
    // Use channels from UI, but ensure proper formatting
    channels = config.channels.map((channel: any, index: number) => {
      // Ensure channel_id is sequential starting from 0
      const channelId = index;
      const channelName = channel.channel_name || `Channel_${channelId}`;
      
      // Convert UI programs format to output format
      const programs: Program[] = (channel.programs || []).map((prog: any, progIndex: number) => {
        // Format program_id as "CHANNELNAME_N" (e.g., "RTK2_1", "KTV_1")
        const programId = `${channelName}_${progIndex + 1}`;
        
        return {
          program_id: programId,
          start: prog.start || 0,
          end: prog.end || 30,
          genre: prog.genre || 'news',
          score: prog.score || 50,
        };
      });

      return {
        channel_id: channelId,
        channel_name: channelName,
        programs,
      };
    });
  } else {
    // Generate channels automatically
    channels = Array.from({
      length: channels_count,
    }).map((_, channelId) => {
      let programs: Program[] = [];
      let currentStart = opening_time;
      let consecutiveGenreCount = 0;
      let lastGenre = "";

      while (currentStart < closing_time) {
        // Calculate available time
        const remainingTime = closing_time - currentStart;
        if (remainingTime < min_duration) break;

        // Generate duration within min/max constraints
        const maxPossibleDuration = Math.min(max_duration, remainingTime);
        const duration = rand(min_duration, maxPossibleDuration);
        const end = currentStart + duration;

        // Pick genre (avoid too many consecutive same genres)
        let genre = pickGenre();
        if (genre === lastGenre && consecutiveGenreCount >= config.max_consecutive_genre) {
          // Force different genre
          const otherGenres = GENRES.filter(g => g !== lastGenre);
          genre = otherGenres[rand(0, otherGenres.length - 1)];
          consecutiveGenreCount = 0;
        } else if (genre === lastGenre) {
          consecutiveGenreCount++;
        } else {
          consecutiveGenreCount = 1;
          lastGenre = genre;
        }

        // Generate score within min/max constraints
        const score = rand(min_score, max_score);

        const channelName = `Channel_${channelId}`;
        const programId = `${channelName}_${programs.length + 1}`;

        programs.push({
          program_id: programId,
          start: currentStart,
          end,
          genre,
          score,
        });

        currentStart = end;
      }

      return {
        channel_id: channelId,
        channel_name: `Channel_${channelId}`,
        programs,
      };
    });
  }

  // Return output fields (exclude generator-only config: min_score, max_score, max_duration)
  const output: any = {
    opening_time,
    closing_time,
    min_duration,
    max_consecutive_genre,
    channels_count,
    switch_penalty,
    termination_penalty,
  };

  // Add optional arrays only if they exist
  if (priority_blocks && priority_blocks.length > 0) {
    output.priority_blocks = priority_blocks;
  }
  if (time_preferences && time_preferences.length > 0) {
    output.time_preferences = time_preferences;
  }
  
  // Always include channels
  output.channels = channels;

  return output;
}
