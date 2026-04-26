import React from 'react';

const words = [
  { word: 'Brave', telugu: 'ధైర్యం', meaning: 'Not afraid to try new things', example: '"You were so brave at the doctor!"' },
  { word: 'Curious', telugu: 'ఆసక్తి', meaning: 'Wanting to learn about everything', example: '"Curious kids ask great questions!"' },
  { word: 'Gentle', telugu: 'మృదువు', meaning: 'Being soft and careful', example: '"Be gentle with the puppy."' },
  { word: 'Grateful', telugu: 'కృతజ్ఞత', meaning: 'Feeling thankful for what you have', example: '"I\'m grateful for my family."' },
  { word: 'Patient', telugu: 'ఓపిక', meaning: 'Waiting without getting upset', example: '"You were so patient in line!"' },
  { word: 'Kind', telugu: 'దయ', meaning: 'Being nice and helpful to others', example: '"That was very kind of you to share."' },
  { word: 'Proud', telugu: 'గర్వం', meaning: 'Feeling happy about something you did', example: '"I\'m proud of you for trying!"' },
  { word: 'Cozy', telugu: 'హాయిగా', meaning: 'Warm and comfortable', example: '"This blanket is so cozy!"' },
  { word: 'Silly', telugu: 'తమాషా', meaning: 'Funny in a playful way', example: '"You\'re being so silly today!"' },
  { word: 'Calm', telugu: 'ప్రశాంతం', meaning: 'Quiet and peaceful inside', example: '"Take a deep breath and feel calm."' },
  { word: 'Explore', telugu: 'అన్వేషించు', meaning: 'To look around and discover new things', example: '"Let\'s explore the park!"' },
  { word: 'Create', telugu: 'సృష్టించు', meaning: 'To make something new', example: '"You can create anything with crayons!"' },
  { word: 'Imagine', telugu: 'ఊహించు', meaning: 'To make pictures in your mind', example: '"Imagine you can fly!"' },
  { word: 'Cooperate', telugu: 'సహకరించు', meaning: 'Working together as a team', example: '"Let\'s cooperate to clean up."' },
  { word: 'Enormous', telugu: 'భారీ', meaning: 'Really, really big', example: '"That dinosaur was enormous!"' },
  { word: 'Tiny', telugu: 'చిన్న', meaning: 'Very, very small', example: '"Look at that tiny ladybug!"' },
  { word: 'Brilliant', telugu: 'అద్భుతం', meaning: 'Very smart or very bright', example: '"What a brilliant idea!"' },
  { word: 'Determined', telugu: 'పట్టుదల', meaning: 'Not giving up, even when it\'s hard', example: '"You were determined to finish the puzzle!"' },
  { word: 'Generous', telugu: 'ఉదారం', meaning: 'Happy to share with others', example: '"It was generous to give your friend a cookie."' },
  { word: 'Magnificent', telugu: 'అద్భుతమైన', meaning: 'So amazing it makes you say wow', example: '"The rainbow was magnificent!"' },
  { word: 'Unique', telugu: 'ప్రత్యేకం', meaning: 'One of a kind, special', example: '"Everyone is unique and that\'s awesome!"' },
  { word: 'Delightful', telugu: 'ఆనందకరం', meaning: 'Something that makes you really happy', example: '"That story was delightful!"' },
  { word: 'Adventurous', telugu: 'సాహసం', meaning: 'Loving to try exciting new things', example: '"You\'re so adventurous on the playground!"' },
  { word: 'Thoughtful', telugu: 'ఆలోచనాపరం', meaning: 'Thinking about how others feel', example: '"It was thoughtful to draw a card for Grandma."' },
  { word: 'Persevere', telugu: 'పట్టుపట్టు', meaning: 'To keep trying even when it\'s tough', example: '"Persevere and you\'ll learn to ride your bike!"' },
  { word: 'Marvelous', telugu: 'అద్భుతం', meaning: 'Wonderful and amazing', example: '"You did a marvelous job!"' },
  { word: 'Responsible', telugu: 'బాధ్యత', meaning: 'Taking care of things you should', example: '"You\'re responsible for feeding the fish."' },
  { word: 'Spectacular', telugu: 'విశేషం', meaning: 'So cool it takes your breath away', example: '"The fireworks were spectacular!"' },
  { word: 'Compassion', telugu: 'కరుణ', meaning: 'Caring about someone who is sad', example: '"You showed compassion when your friend fell."' },
  { word: 'Resilient', telugu: 'తట్టుకునే', meaning: 'Bouncing back when things go wrong', example: '"You\'re resilient — you got back up and tried again!"' },
];

export default function WordOfDay() {
  const dayIndex = Math.floor(Date.now() / 86400000) % words.length;
  const { word, telugu, meaning, example } = words[dayIndex];

  return (
    <div className="widget word-of-day">
      <h2>📖 Word of the Day</h2>
      <div className="wod-line"><span className="wod-word">{word}</span><span className="wod-telugu">{telugu}</span><span className="wod-meaning">{meaning}</span></div>
      <div className="wod-example">{example}</div>
    </div>
  );
}
