// if (Meteor.isServer) {
//   Slingshot.fileRestrictions("myFileUploads", {
//     allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
//     maxSize: 2 * 10024 * 1024,
//   });

//   Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
//         bucket: Meteor.settings.S3Bucket,
//         region: Meteor.settings.region,
//         AWSAccessKeyId: Meteor.settings.awsAccessKeyId,
//         AWSSecretAccessKey: Meteor.settings.awsSecretKey,
//         acl: "public-read",

//       authorize: function (file, metaContext) {
//       if (!this.userId) {
//         var message = "Please login before posting images";
//         throw new Meteor.Error("Login Required", message);
//       }

//       return true;
//       },

//       key: function (file, metaContext) {
//         return new Date().getTime() + "_" + file.name;
//       }

//   });  
//   Meteor.methods({

//   });
// }