const FileBaseSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  guid: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
});

const FileSchema = new SimpleSchema([
  FileBaseSchema,
  {
    createdAt: {
      type: Date,
      optional: true,
    },
    bytes: {
      type: Number,
    },
    service: {
      type: String,
    },
    link: {
      type: String,
    },
  },
]);

const AttachedFilesSchema = new SimpleSchema({
  documents: {
    type: [String],
    optional: true,
  },
  images: {
    type: [String],
    optional: true,
  },
});

Partup.schemas.entities.file = FileSchema;
Partup.schemas.forms.attachedFiles = AttachedFilesSchema;
