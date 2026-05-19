import { analyzeSentiment } from './src/utils/sentiment';
import * as dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    const res = await analyzeSentiment("I am feeling so anxious about my exam today.");
    console.log("Success:", res);
  } catch (e) {
    console.error("Error testing:", e);
  }
})();
