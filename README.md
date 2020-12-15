# CSE 118/218 Team Orchid

<img src="https://github.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_Orchid/blob/main/images/Orchidlogo-06.png" width="300" height="300" align="right">

## Instructions to run:

Open up Git

$ gem install bundler jekyll

$ bundle install (only if you haven’t yet installed bundle) 

$ bundle exec jekyll serve (when in the main folder of project)

It should be running in your localhost 127.0.0.1:4000
 

## **Orchid: Orch**estra **i**n **D**evelopment 

**Description:** An accessible, shared library of audio samples that can be accessed and edited within a collaborative VR space that has a live digital audio workstation that two users can work on at the same time. 

A place for any user to take a break from the conventional methods of music creation and experiment with a new, different musical production space. 
 
## Why is the project useful? 
Musical production isn’t easy and it can be intimidating to start mixing music! It can seem like a lot of time, money, and energy to invest in finding samples and purchasing expensive software. With COVID-19 and social isolation regulations, it’s even more difficult to learn with the help from peers or instructors. 

We’re a few students dedicated to inspiring creativity and optimism for the younger generation. Team Orchid aims to create a new musical creation experience for beginners to scratch the surface of bringing together different samples to create a track and for advanced users to take a break from conventional methods of creating music, and experiment with a virtual music creation space. 

With COVID-19 and remote learning in place, this course had to be done completely through remote platforms like Zoom. For the most part, we’ve never met each other and have had to learn to work together for the past 10 weeks to deliver a final project. A lot of this project and course itself was inspired by the fact that we were remote and how we could create a space that makes collaboration more intimate, especially in our current time period. 

## What does the project do?

![storyboard](https://github.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_Orchid/blob/main/images/story.JPG?raw=true)

Coming into ideating and creating this app, we utilized this story board to think about the stories we wanted to make with our product. We wanted to make sure that the stories that were made could easily be made. This calls for a general idea of easily accessible content and simple user interface which can be seen in our application! 

![DAWwaves](https://github.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_Orchid/blob/main/images/board.png?raw=true)

**Visualization and Ideation**  - As a team, we really wanted our users to be able to literally play around with their music in our space. As seen in the screenshot above, there is a workstation that displays waveforms with a simple user interface which allows users to test and play around with different mixes. With our digital audio workstation, or DAW, users can equip up to five samples onto the lanes of our DAW. When snapped into their respective lanes, each sample’s audio can be put at an offset corresponding to BPM and have their respective volumes adjusted. From there, a user can play a single lane or play them both with the main play/pause button located at the bottom of the DAW. 


![upload1](https://github.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_Orchid/blob/main/images/upload1.png?raw=true)

**Upload Music Samples and Share** - Upload your own music samples or feel free to utilize samples from other users in the database! The upload button is in the top right hander corner where users can upload their own samples directly from their local computer. If interested users can also click on the desk in the room which will show all the samples that are in Orchid’s database. Once a sample is chosen, it gets visualized into a waveform that users can connect to their own workstation to play around with! 

![upload2](https://github.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_Orchid/blob/main/images/upload2.png?raw=true)

If users want to use their own samples, all they have to do is login and upload music from their account! This allows them to have a personal sample library which is connected to the guitar. 

![collab](https://github.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_Orchid/blob/main/images/collab.png?raw=true)

**Collaboration and Relaxation** - Be able to get the opinion of others by hopping on a video call together and ultimately relax in a new musical experience! To achieve this goal, we implemented a video/voice chat feature with WebRTC that users can use while in the space! In this screenshot, one of our team members actually tested the app with two of his good friends who live hundreds of miles away. They played around with the application for a whole hour while just talking with each other, and listening to each other’s audio mixes. 

![system](https://github.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_Orchid/blob/main/images/systems.png?raw=true)
**For our system architecture,** the web application his hosted through jekyll and a web domain. It's displayed on the front-end to the users through babylon.js, JavaScript, and HTML5. The local files system provides music samples and assets which are loaded with the front-end through babylon and JavaScript. The webserver portion is further built on WebXR and babylon.js for virtual reality support and WebRTC support for user intractions by video chatting while collaborating in our virtual space. The web server communicates with our Firebase database that stores audio files and login credentials for each user. 

## How can users get started with the project? 
The main codebase of Orchid is located within the babylon folder, of which the main files are **babylon > babylonjs.html, babylon > main.js, and babylon > firebase.js.** These files reference glb files that import custom meshes into the scene and other images. 

The remainder of the codebase corresponds to the rest of the Orchid website, which is extensible for future additions such as musical education articles. 

## Who maintains and contributed to the project? -- **Team Orchid** 
* **Caroline Sih — Computer Graphics Developer/Audio Engineer.** Caroline is a 4th year BS/MS undergraduate with interests in human-computing interaction and computer architecture. 
* **John Duong — Front-end Developer.** 
* **Luis F.C. — Website Developer.** Luis is a 4th year Cognitive Design and Interaction student with interests in Digital Design. 
* **Chin Lee — Back-end Developer.** Chin is a 1st year MS student majoring in Machine Learning & Data Science with interest in full stack development.
* **Todd Nguyen — Design, QA, and Video Editor.** Todd is a 4th year Cognitive and Behavioral Neuroscience major interested in product management and front-end development! In his free time, he enjoys test cooking to plan his dream menu and ultimately open up a restaurant with his brothers in his mid 30s.  

When actively working on the project, our team had set meeting times of Sundays 4-7pm, Mondays 4-5pm, Thursdays during class time when available, and Fridays 3-4pm. The Sunday meetings were primarily working sessions where we can trade ideas and work towards any larger goals assigned that week. During the last few weeks of the project, we met nearly every day at around 4 PM for daily work sessions. 

To keep track of all of our tasks and problems, we used ZenHub. ZenHub allowed us to organize each week's tasks, as well as keep us on track and connected to our GitHub repository. 

## Help? 
Please contact csih@ucsd.edu if you have any questions pertaining to the upkeep of the project. We’re happy to help! 

## Videos about the project (agile presentations, main presentations, demos) 
* Initial Project Presentation: https://youtu.be/W6BH3d-TB9g 
* Week 6 Agile Report: https://youtu.be/_5KS1Not8FE 
* Week 7 Agile Report: https://youtu.be/oe1cjQ6HiAk 
* Week 8 Agile Report: https://youtu.be/hg1MpsdM2Qg 
* Week 9 Agile Report: https://youtu.be/qaeEN-Nj89s 
* Final Presentation: https://youtu.be/31u0-VLTki0 

## Some tutorials/documentation that we followed/took inspiration from 
* https://webrtc.org/getting-started/firebase-rtc-codelab#what_youll_need 
* https://burtonsmediagroup.com/blog/how-to-load-a-3d-model-with-babylon-js/
* https://burtonsmediagroup.com/blog/changing-the-skybox-and-ground-settings-in-babylon-js/
* https://webrtc.org/getting-started/firebase-rtc-codelab#what_youll_need 
* https://playground.babylonjs.com/#J19GYK#206 
* https://www.babylonjs-playground.com/#B2DP5I#7 
* https://playground.babylonjs.com/#MT5MZY#1 
* https://playground.babylonjs.com/#0LJKFP#2 


# Big special thanks to Professor Weibel and Jessica for instructing a great class! 

