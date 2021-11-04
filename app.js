const gitLabRouter = require("./route/gitlab");
const bot = require("./route/bolt");

const app = express();

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "development") require("dotenv").config();
// Initializes your app with your bot token and signing secret

app.use("/gitlab", gitLabRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  async () => {
    await app.start(PORT);
    console.log(`Slack Bot app is running on port ${PORT}`);
  };
  console.log("Server is running too", PORT);
});
