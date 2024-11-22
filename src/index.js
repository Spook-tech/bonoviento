require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

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
      link: 'https://meet.google.com/jvr-jsjb-yuo',
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
      link: 'https://us05web.zoom.us/j/8411452864?pwd=ZVRXUlFrQ3B6YVVKZUt3eVozMTU3UT09',
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
      link: 'Група 1 (я тут) - https://us04web.zoom.us/j/78391294205?pwd=5rWx46hBcbLTAuqrlKhIASfJHw5CbU.1 /n Група 2 - https://us05web.zoom.us/j/4928111409?pwd=YVIxOFdXemhRTGRjbWJpQzg1OFVhdz09',
   },

   ukraine: {
      name: 'Захист України',
      link: 'https://meet.google.com/edi-vavh-kri',
   },

   culture: {
      name: 'Культорологія',
      link: 'https://meet.google.com/jvr-jsjb-yuo',
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

async function getCatImage() {
   try {
      let response = await fetch("https://api.thecatapi.com/v1/images/search"); // Запрос на получение случайного изображения
      if (response.ok) {
         let json = await response.json();
         return json[0].url; // Возвращаем URL изображения кота
      } else {
         console.log("Ошибка HTTP: " + response.status);
      }
   } catch (error) {
      console.error("Ошибка запроса:", error);
   }
}

async function sendMessage(messageText) {
   const channel = client.channels.cache.get('1304557538439598151');

   if (!channel) {
      console.log('Канал не найден');
      return;
   }

   const random = Math.floor(Math.random() * 100) + 1;
   if (random < 26) {
      const catImageUrl = await getCatImage();

      if (catImageUrl) {
         await channel.send({
            content: `${messageText}\nВам повезло, и с шансом 25% вам попалась фотография кота для поднятия настроения!`,
            files: [catImageUrl]
         });
      } else {
         await channel.send(messageText);
      }
   } else {
      await channel.send(messageText);
   }
}

client.on('ready', () => {
   console.log(`Logged in as ${client.user.tag}!`);


   // Функция для отправки расписания и проверки текущего дня
   const sendDailyMessage = async () => {
      const currentDay = getCurrentDay();

      if (currentDay !== "Sunday" && currentDay !== "Saturday") {
         const schedule = generateTodaySchedule();

         let messageText = 'Доброе утро! Я Артем Бонов! Вот розклад на сегодня: \n';
         schedule.lessons.forEach((lesson, index) => {
            messageText += `Пара #${index + 1}. ${lesson.name} - ${lesson.link}\n`;
         });

         await sendMessage(messageText);
      } else {
         await sendMessage("Доброе утро! Я Артем Бонов! Сегодня выходной!");
      }
   };

   const sendScheduledMessage = async (lessonIndex) => {
      const currentDay = getCurrentDay();

      if (currentDay !== "Sunday" && currentDay !== "Saturday") {
         const schedule = generateTodaySchedule();

         if (schedule.lessons[lessonIndex]) {
            const lesson = schedule.lessons[lessonIndex];

            
            if (lesson.name == '-') {
               await sendMessage(`Пара #${lessonIndex + 1} не начнется через 5 минут. Её нету!`);
               return "";
            }
            
            const random = Math.floor(Math.random() * 100) + 1;
            if (random < 6) {
               await sendMessage(`Пара #${lessonIndex + 1} начнется через 5 минут.  ${lesson.name} - К сожалению, вам не повезло, и ссылку на урок прийдется искать самому, удачи! ♥`);
               return;
            }

            await sendMessage(`Пара #${lessonIndex + 1} начнется через 5 минут. ${lesson.name} - ${lesson.link}`);
         }
      }
   };

   // Задачи с расписанием
   const scheduleTimes = ['25 8 * * *', '55 9 * * *', '45 11 * * *', '15 13 * * *'];

   cron.schedule('00 8 * * *', sendDailyMessage);

   scheduleTimes.forEach((time, index) => {
      cron.schedule(time, () => sendScheduledMessage(index));
   });

   cron.schedule('00 00 * * *', () => sendMessage("Спокойной ночи! Я Артем Бонов!"));
});


client.on('messageCreate', async (message) => {
   if (message.author.bot) return;


   if (message.content === 'test') {
      sendMessage('test')
   }

   if (message.content === 'day') {
      message.reply('answer');
   }
});
