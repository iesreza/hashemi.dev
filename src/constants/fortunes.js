/**
 * Collection of programming quotes and wisdom
 * Used by the fortune command to display random programming-related quotes
 */
export const fortunes = [
  // Programming Wisdom
  '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
  '"First, solve the problem. Then, write the code." - John Johnson',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
  '"The best error message is the one that never shows up." - Thomas Fuchs',
  '"Simplicity is the soul of efficiency." - Austin Freeman',
  '"Make it work, make it right, make it fast." - Kent Beck',
  '"Programs must be written for people to read, and only incidentally for machines to execute." - Harold Abelson',
  '"The most damaging phrase in the language is: We\'ve always done it this way." - Grace Hopper',
  '"Premature optimization is the root of all evil." - Donald Knuth',
  '"Clean code always looks like it was written by someone who cares." - Robert C. Martin',

  // Tech Humor
  '"It works on my machine." ¯\\_(ツ)_/¯',
  '"There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton',
  '"99 little bugs in the code, 99 bugs in the code. Take one down, patch it around, 127 bugs in the code..."',
  '"A SQL query walks into a bar, walks up to two tables and asks... Can I join you?"',
  '"How many programmers does it take to change a light bulb? None, that\'s a hardware problem."',
  '"Java is to JavaScript what car is to carpet." - Chris Heilmann',
  '"There are 10 types of people: those who understand binary and those who don\'t."',
  '"Debugging is like being the detective in a crime movie where you are also the murderer."',
  '"A user interface is like a joke. If you have to explain it, it\'s not that good."',
  '"Programming is 10% writing code and 90% understanding why it\'s not working."',

  // Developer Culture
  '"Talk is cheap. Show me the code." - Linus Torvalds',
  '"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie',
  '"Software is a great combination between artistry and engineering." - Bill Gates',
  '"The computer was born to solve problems that did not exist before." - Bill Gates',
  '"Good code is its own best documentation." - Steve McConnell',
  '"Deleted code is debugged code." - Jeff Sickel',
  '"Code never lies, comments sometimes do." - Ron Jeffries',
  '"Programming isn\'t about what you know; it\'s about what you can figure out." - Chris Pine',
  '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
  '"The best thing about a boolean is even if you are wrong, you are only off by a bit."',

  // Motivational
  '"Every great developer you know got there by solving problems they were unqualified to solve until they actually did it." - Patrick McKenzie',
  '"The most important property of a program is whether it accomplishes the intention of its user." - C.A.R. Hoare',
  '"It\'s not a bug – it\'s an undocumented feature."',
  '"Learning to code is learning to create and innovate." - Enda Kenny',
  '"The best way to predict the future is to implement it." - David Heinemeier Hansson',
  '"Code is poetry." - WordPress',
  '"The function of good software is to make the complex appear to be simple." - Grady Booch',
  '"Software and cathedrals are much the same – first we build them, then we pray." - Sam Redwine',
  '"Don\'t worry if it doesn\'t work right. If everything did, you\'d be out of a job." - Mosher\'s Law',
  '"Before software can be reusable it first has to be usable." - Ralph Johnson',

  // Bug & Debug Humor
  '"If debugging is the process of removing bugs, then programming must be the process of putting them in." - Edsger Dijkstra',
  '"Weeks of coding can save you hours of planning."',
  '"Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday\'s code." - Dan Salomon',
  '"No code has zero bugs, it just has bugs you haven\'t found yet."',
  '"The cheapest, fastest, and most reliable components are those that aren\'t there." - Gordon Bell',
  '"Real programmers count from 0."',
  '"Keyboard not found. Press F1 to continue."',
  '"To err is human, but to really foul things up you need a computer." - Paul Ehrlich',
  '"I\'m not anti-social; I\'m just not user friendly."',
  '"Home is where you don\'t have to `cd`."',

  // Backend & Systems
  '"There is no cloud, it\'s just someone else\'s computer."',
  '"A good programmer is someone who always looks both ways before crossing a one-way street." - Doug Linder',
  '"Measuring programming progress by lines of code is like measuring aircraft building progress by weight." - Bill Gates',
  '"Testing leads to failure, and failure leads to understanding." - Burt Rutan',
  '"The question of whether a computer can think is no more interesting than the question of whether a submarine can swim." - Edsger Dijkstra',
  '"Hofstadter\'s Law: It always takes longer than you expect, even when you take into account Hofstadter\'s Law." - Douglas Hofstadter',
  '"The best performance improvement is the transition from the nonworking state to the working state." - John Ousterhout',
  '"Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live." - John Woods',
  '"Documentation is a love letter that you write to your future self." - Damian Conway',
  '"Legacy code is code without tests." - Michael Feathers'
]

/**
 * Get a random fortune quote
 * @returns {string} A random programming quote
 */
export const getRandomFortune = () => {
  const randomIndex = Math.floor(Math.random() * fortunes.length)
  return fortunes[randomIndex]
}
