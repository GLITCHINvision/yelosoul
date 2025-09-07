import mongoose from "mongoose";

const occasionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: String
    // No manual products array anymore
  },
  { timestamps: true }
);

const Occasion = mongoose.model("Occasion", occasionSchema);
export default Occasion;








