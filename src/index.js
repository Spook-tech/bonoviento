require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

console.log(1, process.env.DISCORD_TOKEN)

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
   console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

console.log(new Date())

function getCurrentDay() {
   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   const date = new Date();
   const dayOfWeek = days[date.getDay()];

   return dayOfWeek;
}

const lessons = {
   ukrLanguage: {
      name: 'Українська мова',
      link: 'https://meet.google.com/vkb-opij-giw',
   },

   ukrLiterature: {
      name: 'Українська Література',
      link: 'https://meet.google.com/vkb-opij-giw',
   },

   math: {
      name: 'Математика',
      link: 'https://us04web.zoom.us/j/77948516750?pwd=GsEdbMdMzOXNwG6yjrbfGPOYInNqXZ.1',
   },

   cultural: {
      name: 'Культурологія',
      link: 'https://meet.google.com/vkb-opij-giw',
   },

   graphics: {
      name: 'Чертежи',
      link: 'В дискорде',
   },

   metrology: {
      name: 'Метрологія',
      link: 'https://us04web.zoom.us/j/72400955257?pwd=B53aUQS3gkEuZMMafU9DnHf9Ac8brb.1',
   },

   civicEducation: {
      name: 'Громадянська освіта',
      link: 'https://us05web.zoom.us/j/86781094480?pwd=WE9Nc3puOFhKVFppWnoxRjhpWG9nUT09',
   },

   physics: {
      name: 'Фізика',
      link: 'https://us05web.zoom.us/j/9187687466?pwd=RXVNVTJTNUswUDhLSXpVVS8vbnQwQT09',
   },

   technologies: {
      name: 'Технології',
      link: 'https://us04web.zoom.us/j/3445315107?pwd=MFFTYjFoNDk2eVFxaUxkZndKL2E5UT09',
   },

   biology: {
      name: 'Біологія',
      link: 'https://us05web.zoom.us/j/8411452864?pwd=ZVRXUlFrQ3B6YVVKZUt3eVoz',
   },

   sport: {
      name: 'Фізична культура',
      link: '',
   },

   history: {
      name: 'Історія України',
      link: 'В дискорде',
   },

   english: {
      name: 'English',
      link: 'Уточняю данные...',
   },

   ukraine: {
      name: 'Захист України',
      link: 'https://meet.google.com/edi-vavh-kri',
   },

   culture: {
      name: 'Культорологія',
      link: 'https://meet.google.com/rog-rnza-aks',
   },

   blank: {
      name: '-',
      link: '',
   },
}

const shelude = [
   {
      day: 'Monday',
      lessons: [
         lessons.math,
         lessons.graphics,
         lessons.metrology,
         lessons.ukrLanguage,
      ]
   },
   {
      day: 'Tuesday',
      lessons: [
         lessons.civicEducation,
         lessons.physics,
         lessons.technologies,
      ]
   },
   {
      day: 'Wednesday',
      lessons: [
         lessons.biology,
         lessons.graphics,
         lessons.ukrLanguage,
         lessons.sport,
      ]
   },
   {
      day: 'Thursday',
      lessons: [
         lessons.math,
         lessons.history,
         lessons.physics,
         lessons.technologies,
      ]
   },
   {
      day: 'Friday',
      lessons: [
         lessons.blank,
         lessons.english,
         lessons.ukraine,
         lessons.cultural,
      ]
   },
];

function generateTodaySchedule() {
   const currentDay = getCurrentDay();

   if (currentDay == "Sunday" || currentDay == "Saturday") {
      return '';
   }

   let result;
   shelude.forEach(day => {
      if (day.day == currentDay) {
         result = day;
      }
   });

   return result;
}

client.on('ready', message => {
   console.log(`Logged in as ${client.user.tag}!`);
   const currentDay = getCurrentDay();
   const channel = client.channels.cache.get('1304557538439598151');

   if (!channel) {
      console.log('Канал не найден');
      return;
   }

   if (currentDay !== "Sunday" && currentDay !== "Saturday") {
      const schedule = generateTodaySchedule();

      console.log(schedule)

      const sendScheduledMessage = (lessonIndex) => {
         schedule.lessons.forEach((lesson, index) => {
            if (index == lessonIndex) {
               channel.send(`Пара #${index + 1} почнеться через 5 хвилин. ${lesson.name} - ${lesson.link} \n`)
            }
         });
      };

      const scheduleTimes = ['25 8 * * *', '55 9 * * *', '45 11 * * *', '15 13 * * *'];

      cron.schedule('00 00 * * *', () => channel.send("Спокойной ночи! Я Артем Бонов!"));

      let messageText = '';
      schedule.lessons.forEach((lesson, index) => {
         messageText += `Пара #${index + 1}. ${lesson.name} - ${lesson.link}\n`;
      });

      cron.schedule('00 6 * * *', () => channel.send("Доброе утро! Я Артем Бонов! Вот розклад на сегодня: \n" + messageText));

      scheduleTimes.forEach((time, index) => {
         cron.schedule(time, () => sendScheduledMessage(index));
      });
   }
});

client.on('messageCreate', message => {
   if (message.author.bot) return;

   
   if (message.content === 'тест') {
      message.reply('answer');
   }

   if (message.content === 'day') {
      message.reply('answer');
   }
});
