var UserSchema = new Schema({
  username: String,
  fname:String,
  lname:String,
  type: Number,
  admin: Number,
  facebook_id: String,
  email: String,
  date: Date,
  questions:[{type: Schema.ObjectId, ref:'Qestions'}]
});

mongoose.model('Users', UserSchema);
