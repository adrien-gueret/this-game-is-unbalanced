<p align="center">
  <img src="https://github.com/user-attachments/assets/29ec1cca-36c4-4112-8906-d874a7c91f39" alt="" />
</p>

# This game is unbalanced!

Game developers know that: **it's hard to balance a game**.

You create your nice game and your playtesters just say : "This game is unbalanced!".
They all have their specific desires and their own concept of what a balanced game is... It's so hard to satisfy the players!

In "This game is unbalanced!", you watch a little monster play some games. Unfortunately they are all unbalanced for this little fella: either too easy or too difficult... So your goal is to balance them!

<p align="center">
  <img src="https://github.com/user-attachments/assets/452632c5-1cd6-42e9-bac9-b86c35ccfb13" alt="" />
</p>

-----


**A game created for [GamedevJS 2024](https://gamedevjs.com/jam/2025/).  
Theme: BALANCE**

-----

<p align="center">
  <img src="https://github.com/user-attachments/assets/ed7f9c5d-1ed9-4c35-9e84-5b85d5d2ae96" alt="" />
</p>

## Challenges

- **Open Source Challenge**  
  Source code is published here: https://github.com/adrien-gueret/this-game-is-unbalanced
- **Build it with Phaser Challenge**  
  This game is built with Phaser (even though I had never used the library before!It's my first game with it, I'm sure there are a lot of weird things in my code :D )
- **$NOODS Challenge**  
  Goal was to vibe code a Phaser game: I've heavily used Copilot and its agent mode to build this project. Learn more about that below.

-----

<p align="center">
  <img src="https://github.com/user-attachments/assets/c9979416-f8e3-4ca2-a008-c9aba4441eef" alt="" />
</p>

## Credits

### Graphisms  
Backgrounds generated via ChatGPT  
Spritesheets create by myself on good-old Paint :)  

### Audio  
Music from SUNO AI  
Some sounds effect from [Kenney](https://kenney.nl/assets/category:Audio?sort=update)  
Other sounds from [jsfxr](https://sfxr.me/)  
One or two jingle effects were stored on my computer since quite a time now: I unfortunately don't remember where I get them ^^'

<p align="center">
  <img src="https://github.com/user-attachments/assets/66052bd9-89c2-482f-816a-87d6c10aca27" alt="" />
</p>

### Game concept  
By myself

### Code  
Around 40% of the code written by myself  
Around 60% of the code written by Copilot _(see below to know more!)_

-----

<p align="center">
  <img src="https://github.com/user-attachments/assets/7d3be209-c887-46cd-add6-b4a33ac04fed" alt="" />
</p>

## Vibe coding? Is it worth it?

In order to create _"This game is unbalanced!_", my partner in crime was copilot. This game has been built in less than 13 days with Phaser... while I have 0 knowledge on Phaser.

I've started asking Copilot to create a template for a Phaser project: it did a good job with importing correctly the library and creating a basic project architecture.

Then I told Copilot my idea, with more or less precise specs, and it started to create Phaser scenes by itself! The result was quite impressive 'cause it was more or less what I had in mind. It was ugly, for sure, but it was a very good base for my game!

The next steps were quite easy: giving more instructions to Copilot, or very specific Phaser stuff. I've asked him how to add my own graphics, how to add spritesheets, how to animate them and so on.** This step was the most important one**: I've tried **to understand the code it wrote for me**, and I asked for some explanations when needed.

Honestly, thanks to that, **I've learned how to write a Phaser game without reading any docs nor tutorials!** Quite impressive.

At first my goal was only to balance a platform game but, since vibe coding a Phaser game was fun and interesting, I wanted to go even further. What if I could code more types of games?

That's why _"This game is unbalanced!"_ also have RPG-like fighting levels. Like the platforms ones, I've tried to understand how the generated code works, and I did a lot of refactors to make it better (well... better in my opinion at least!).

Two types of game weren't enough, so I've decided to vibe-code a third one: a racing game, ala _"Super Mario Kart"_! But it was a bit too ambitious... Impossible for Copilot to generate a Mode 7 effect, and I could not find any tutorials to create one by myself. I was a bit surprised, since Phaser seems to be very good for any 2D games!

So I gave up on the racing game and I switched to Match 3.  
The deadline  was approaching so I didn't refactor any of Copilot code on this one. [The Match 3 Simulation file](https://github.com/adrien-gueret/this-game-is-unbalanced/blob/main/src/simulations/Match3Simulation.js) is probably the most hideous one on this project, with a lot of dead comments Frenglish stuff between almost 1500 lines... ^^'

But anyway.

It was very fun, and I thank the Gamedev.js organizers to encourage us to test vibe coding. 

Before the jam I didn't know Phaser at all.  
But I was able to submit a full game built with it and containing 3 different types of mini-games.  
And I learnt how to use Phaser.

All thanks to Copilot.

Just wow. 

--

To balance a bit this return of experience (hey, it is the theme of the gamejam after all!) please note I am a web developer for years now, I know how to code, I know good patterns and I can detect when the AI is trying to bullshit me.

I am not sure the tool will be that efficient for a junior developer. It will certainly help it to start quicker, but without being able to understand the generated code it can be more harmful than helpful, I guess (again just look at [the Match 3 Simulation file](https://github.com/adrien-gueret/this-game-is-unbalanced/blob/main/src/simulations/Match3Simulation.js), it's a total mess!).

If the user of the AI has the goal to learn and understand what the AI is generating, **it could be the best educational support ever made**.

But if its goal is to only click "accept" on everything the AI suggests in order to develop an app whatever the code quality. **It could be the most efficient unmaintainable code generator ever made :)**

--

Oopsy, I've gone a bit beyond the scope of the game description. I may write an article about that one day! If so I'll put the link here.

Thanks for reading — I hope you had fun with my first Phaser game!

<p align="center">
  <img src="https://github.com/user-attachments/assets/a4dc104e-2d9f-415b-ac3c-d0f8f0ef7e19" alt="" />
</p>
