// import { date, random } from 'faker';

// const randNum = (min, max) => random.number({ min, max });

// const userTemplate = {
//     _id: Random.id(),

//     createdAt: date.past(), // should be 'created_at'

//     completeness: 0,
//     participant_score: 0,

//     profile: {
//         name: '',
//         normalized_name: '',
//         image: '', // should be 'image_id'
//         settings: {
//             locale: random.locale(),
//             optionalDetailsCompleted: random.boolean(),
//             email: { // should be 'notification_profile_id' as there are only so many combinations possible;
//                 dailydigest: random.boolean(),
//                 upper_mentioned_in_partup: random.boolean(),
//                 upper_mentioned_in_network_chat: random.boolean(),
//                 invite_upper_to_partup_activity: random.boolean(),
//                 invite_upper_to_network: random.boolean(),
//                 partup_created_in_network: random.boolean(),
//                 partups_networks_new_pending_upper: random.boolean(),
//                 partups_networks_accepted: random.boolean(),
//                 partups_new_comment_in_involved_conversation: random.boolean(),
//                 partups_networks_new_upper: random.boolean(),
//                 partups_networks_upper_left: random.boolean(),
//             },
//         },
//         description: random.words(randNum(4, 30)),
//         tags: range(randNum(3, 8).map(random.word)),
//         location: {

//         },
//         facebool_url: '',
//         twitter_url: '',
//         instagram_url: '',
//         linkedin_url: '',
//         phonenumber: '',
//         website: '',
//         skype: '',
//         meurs: {
//             portal: '',
//             en_id: '',
//             nl_id: '',
//             program_session_id: '',
//             fetched_results: true,
//             results: [
//                 {
//                     code: 0,
//                     name: '',
//                     score: 0,
//                     zscore: 0,
//                     dscore: 0,
//                     highIndex: 0,
//                 },
//             ],
//         },
//     },

//     status: {
//         online: true,
//         idle: true,
//         lastLogin: {
//             date: '',
//             ipAddr: '',
//             userAgent: '',
//         },
//     },

//     emails: [
//         {
//             adress: '',
//             verified: '',
//         },
//     ],
//     registered_emails: [
//         {
//             adress: '',
//             verified: '',
//         },
//     ],
//     services: {
//         password: {
//             bcrypt: '',
//         },
//         resume: {
//             loginTokens: [
//                 {
//                     when: new Date(),
//                     hashedToken: '',
//                 },
//             ],
//         },
//         email: {
//             verificationTokens: [
//                 {
//                     token: '',
//                     adress: '',
//                 },
//             ],
//         },
//     },
//     logins: [
//         '', // Dates, why not store it in ms?
//     ],
//     flags: {
//         dailyDigestEmailHasBeenSent: true,
//     },

//     // This is wrong!
//     networks: [
//         '',
//     ],
//     // This is wrong!
//     upperOf: [
//         '',
//     ],
//     // This is wrong!
//     chats: [
//         '',
//     ],
// };

// const fromTemplate =
//     baseTemplate =>
//         (extendingTemplate, ...args) =>
//             () => {
//                 return assignIn(baseTemplate, extendingTemplate);

//             }


// const createUserFixtures = (template, ...args) =>
//     range(randNum(30, 100)).map(fromTemplate(userTemplate)(template, ...args));

