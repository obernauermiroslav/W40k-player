/*
    const express = require("express");: This line imports the Express framework 
    and assigns it to the express variable using Node.js's require function.

    const path = require("path");: This line imports the Node.js path module 
    which provides utilities for working with file and directory paths.

    const mysql = require("mysql2");: This line imports the MySQL2 module which 
    is a MySQL database client for Node.js.

    const app = express();: This line creates an instance of the Express application.

    var fs = require("fs");: This line imports the Node.js fs module which provides 
    file system-related functionality.

    var mm = require("musicmetadata");: This line imports the musicmetadata module which 
    provides a way to extract metadata from audio files.

    const multer = require("multer");: This line imports the multer module which is used 
    to handle file uploads in the application.

    const upload = multer({ dest: "uploads/" });: This line creates a new multer 
    instance and sets the destination directory for uploaded files to be stored.

    app.set("view engine", "ejs");: This line sets the view engine to be used by 
    the application to EJS (Embedded JavaScript).

    app.use(express.urlencoded({ extended: true }));: This line configures the 
    application to use the express.urlencoded middleware which parses incoming request bodies 
    in a URL-encoded format.

    express.static("static");: This line is not doing anything since it's missing 
    an assignment to an app.use() statement.

    express.static("audio");: This line is not doing anything since it's missing 
    an assignment to an app.use() statement.

    app.use(express.json());: This line configures the application to use the express.json 
    middleware which parses incoming request bodies in a JSON format.

    app.use(express.static(__dirname));: This line configures the application to serve 
    static files from the root directory of the project.

    app.use("/static", express.static(path.join(__dirname, "static")));: 
    This line configures the application to serve static files from the static directory.

    app.use("/audio", express.static(path.join(__dirname, "audio")));: This line configures 
    the application to serve static files from the audio directory.

    const connection = mysql.createConnection({ host: "localhost", user: "gfa", database: "player", });: 
    This line creates a connection to the MySQL database using the mysql.createConnection method 
    and assigns the connection object to the connection variable. The host, user, and database 
    properties are set to the appropriate values for the MySQL database being used by the application.
*/

const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const app = express();
var fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "audio/" });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

express.static("static");
express.static("audio");
app.use(express.json());
app.use(express.static(__dirname));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/audio", express.static(path.join(__dirname, "audio")));

const connection = mysql.createConnection({
  host: "localhost",
  user: "gfa",
  database: "player",
});

connection.query(
  `CREATE TABLE IF NOT EXISTS URL_list 
        (id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
         title VARCHAR(200),
         url VARCHAR(300)
        );`,
  (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("Table: URL_list created if it did not exist");
  }
);


connection.query(
  `CREATE TABLE IF NOT EXISTS songList 
        (id INT AUTO_INCREMENT primary key NOT NULL, 
         title varchar(200),
         src VARCHAR(300) ,
         duration VARCHAR(300),
         image VARCHAR(300) 
        );`,
  (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("table : songlist created if did not exist");
  }
);


app.get("/", (req, res) => {
  connection.query("SELECT * FROM songlist", (err, songData) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      connection.query("SELECT * FROM URL_list", (err, urlData) => {
        if (err) {
          console.log(err);
          res.status(500).json(err);
        } else {
          res.render("index.ejs", { data: songData, data2: urlData });
        }
      });
    }
  });
});



/*
const songs = [
  {
    title: "warhammer - The one",
    src: "audio/warhammer.mp3",
    duration: "2:24",
    image: "img/titan1.gif",
  },
  {
    title: "reset music",
    src: "audio/reset.mp3",
    duration: "4:51",
    image: "img/titan2.gif",
  },
  {
    title: "heavy music",
    src: "audio/heavy.mp3",
    duration: "3:48",
    image: "img/titan3.gif",
  },
  {
    title: "Within Temptation : The fire within",
    duration: "3:33",
    src: "audio/Within Temptation - The Fire Within.mp3",
    image: "img/titan4.gif",
  },
  {
    title: "Carmina gloria - medieval metal",
    src: "audio/carmina.mp3",
    duration: "6:38",
    image: "img/titan5.gif",
  },
  {
    title: "MM6 arena music",
    src: "audio/arena.mp3",
    duration: "4:20",
    image: "img/titan6.gif",
  },
];

/*
app.post("/api/songs", (req, res) => {
  const dataNew = [];
  for (let i = 0; i < songs.length; i++) {
    connection.query(
      `SELECT * FROM songlist WHERE  title = ? AND src = ?  AND duration = ? AND image = ?  `,
      [songs[i].title, songs[i].src, songs[i].duration, songs[i].image],
      (err, rows) => {
        if (err) {
          return res.status(500).json(err);
        }
        if (rows.length === 0) {
          dataNew.push([
            songs[i].title,
            songs[i].src,
            songs[i].duration,
            songs[i].image,
          ]);
        }
        if (i === songs.length - 1) {
          if (dataNew.length > 0) {
            connection.query(
              `INSERT INTO songlist (title, src, duration, image) VALUES ? `,
              [dataNew],
              (err) => {
                if (err) {
                  return res.status(500).json(err);
                }
                connection.query(
                  `SELECT * FROM songlist WHERE id >= ?`,
                  [data.length + 1],
                  (err, newSongs) => {
                    if (err) {
                      return res.status(500).json(err);
                    }
                    songs.push(...newSongs);
                    return res
                      .status(200)
                      .json({ message: "songs are added to the table", newSongs });
                  }
                );
              }
            );
          } else {
            return res.status(400).json({ error: "data already in table" });
          }
        }
      }
    );
  }
});

*/
let songs = [];

app.post("/api/songs", (req, res) => {
  for (let i = 0; i < songs.length; i++) {
    connection.query(
      `INSERT INTO songlist (title, src, duration, image) VALUES ? `,
      [[songs[i]]],
      (err) => {
        if (err) {
         // return res.status(500).json(err);
        }
      }
    );
  }
  connection.query(
    'SELECT * FROM songlist', (error, result) => {
      if(error) {
        return res.status(500).json(error)
      }else{
        console.log(result)
        return res.status(200).json(result)
        
      }
    }
  )
  //return res.status(200).send();
});

app.post("/addSong", upload.single("songFile"), async (req, res) => {
  const allowedExtensions = [".mp3"];
  let songTitle = req.body.title || req.file.originalname;
  const fileExtension = path.extname(songTitle).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    fs.unlinkSync(req.file.path);
    return res
      .status(400)
      .send("Invalid file type. Only mp3 files are allowed.");
  }
  songTitle = songTitle.replace(/\.mp3$/, "");
  const songPath = `${req.file.destination}/${req.file.filename}`;

  try {
    const mm = await import("music-metadata");
    const metadata = await mm.parseFile(songPath);
    const duration = metadata.format.duration || 0;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60)
      .toString()
      .padStart(2, "0");
    const durationFormatted = `${minutes}:${seconds}`;

    // move uploaded file to /audio directory
    const oldPath = req.file.path;
    const newPath = `audio/${songTitle}.mp3`;
    fs.renameSync(oldPath, newPath);

    const query =
      "INSERT INTO songList (title, src, duration, image) VALUES (?, ?, ?, ?)";
    connection.query(
      query,
      [
        songTitle,
        `audio/${songTitle}.mp3`,
        durationFormatted,
        "img/titan1.gif",
      ],
      async (err, result) => {
        if (err) throw err;
        console.log("Song added to the database");
        // Add the new song to the songs array
        const newSong = {
          title: songTitle,
          src: `audio/${songTitle}.mp3`,
          duration: durationFormatted,
          image: "img/titan1.gif",
        };
        songs.push(newSong);
        res.redirect("/");
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding song to the database");
  }
});

app.get("/playSong/:songTitle", (req, res) => {
  const songTitle = req.params.songTitle;
  const song = songs.find((s) => s.title === songTitle);
  if (!song) {
    return res.status(404).send("Song not found");
  }
  // render the playSong view with the song data
  res.render("playSong", { song });
});


app.post("/api/posts/submit", (req, res) => {
  const { Title: title, URL: url } = req.body;
  connection.query(
    `INSERT INTO URL_list (title, url) VALUES (?, ?)`,
    [title, url],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.redirect("/");
    }
  );
});






app.listen(3000);
