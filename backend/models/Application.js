// const mongoose = require('mongoose');

// const ApplicationSchema = new mongoose.Schema({
//   jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
//   candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   matchScore: { type: Number, required: true }, 
//   status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
// });

// module.exports = mongoose.model('Application', ApplicationSchema);


const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchScore: { type: Number, required: true }, 
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  // ADD THIS LINE: To permanently store where the PDF is saved on the server
  resumePath: { type: String, required: true } 
}, { timestamps: true }); // Tip: Adding timestamps automatically records when they applied!

module.exports = mongoose.model('Application', ApplicationSchema);