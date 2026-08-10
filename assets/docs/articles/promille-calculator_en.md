# Promille Calculator: Blood Alcohol and How Long Until You're Sober

The morning after, the question that actually matters is rarely "how drunk was I". It is "how much is still in me, and how long until it is gone". A promille calculator answers that with arithmetic, and the arithmetic is genuinely simple: one formula from 1932, two numbers about your body, and one rate at which your liver works.

What follows is that calculation, running live below, followed by an honest account of what it can and cannot tell you. There is no secret here worth guarding. The formula is a century old and any search engine will hand it to you. What is worth saying out loud is how far you should trust the number it produces, because most calculators present a result to two decimal places and leave you to assume that means precision.

This is not medical advice, and it is never a fitness-to-drive test. More on why that matters below.

[[BAC_CALCULATOR]]

## First, how many grams did you actually drink?

The calculator asks for grams of pure alcohol rather than "two beers", and that is deliberate. A small strong drink and a large weak one can hold exactly the same amount of alcohol, so grams are the only unit that lets you add an evening up.

Getting from a glass to grams takes one multiplication: volume in millilitres, times the strength as a decimal, times 0.8 (the density of ethanol). A 500 ml beer at 5% is 500 × 0.05 × 0.8 = 20 grams. Here is what common servings come to.

| Drink | Typical serving | Pure alcohol (approx.) |
|---|---|---|
| Small glass of wine | 125 ml (12%) | ~12 g |
| Standard glass of wine | 175 ml (12%) | ~17 g |
| Large glass of wine | 250 ml (13%) | ~26 g |
| Bottled beer | 330 ml (5%) | ~13 g |
| Pint of lager or ale | 568 ml (5%) | ~22 g |
| Single spirit | 25 ml (40%) | ~8 g |
| Double spirit | 50 ml (40%) | ~16 g |

Add up everything from the day and you have the number the calculator wants. This is also the step people get wrong most often, because it relies on remembering both what you drank and how large the pours were, several hours after the fact.

## The formula behind the number

The calculation is the [**Widmark formula**](https://en.wikipedia.org/wiki/Blood_alcohol_content), published by the Swedish chemist Erik Widmark in 1932 and still the basis of forensic blood alcohol estimation today:

**c = A / (m × r)**

- **c** is the blood alcohol concentration in per mille (‰)
- **A** is the grams of pure alcohol you drank
- **m** is your body mass in kilograms
- **r** is the distribution factor

The distribution factor is the part that needs explaining. Alcohol dissolves in water, not fat, so it spreads through the watery part of your body rather than all of it. **r** is the fraction of your body mass that alcohol actually distributes into. Because body composition differs on average between men and women, the standard values are **0.7 for men** and **0.6 for women**. Relimie uses **0.65** when gender is unset or recorded as other, which is the midpoint: it does not guess a body composition, and it errs neither systematically high nor low.

So for an 80 kg man who drank three half-litre beers, that is 60 grams of alcohol:

**60 / (80 × 0.7) = 1.07 ‰**

The same 60 grams in a 60 kg woman gives 60 / (60 × 0.6) = 1.67 ‰. Same drinks, a very different number, which is the single most useful thing the formula shows you.

## How long until it is gone

Your body then clears alcohol at a roughly constant rate, regardless of how much is in there. That is unusual, and it is why the wait is so much longer than people expect: the level comes down in a straight line, not a curve that drops off quickly at first.

The rate sits somewhere around **0.15 ‰ per hour** for most people, which is the value used here. From 1.07 ‰, that is 1.07 / 0.15 = about **7 hours and 10 minutes** to reach zero. Someone who stopped drinking at 1 a.m. is still not clear at 8 a.m.

Nothing meaningfully speeds this up. Coffee, a cold shower, fresh air, exercise, a large breakfast and a night's sleep all change how awake you feel, and none of them change the rate at which your liver metabolises ethanol. Feeling fine and being clear are two different states, and the gap between them is precisely where people get into trouble. Eating *before* or *during* drinking does help, because food slows absorption and lowers the peak, but once the alcohol is in your blood, only time removes it.

## How much can you trust this number?

Less than the two decimal places suggest. This deserves a straight answer rather than a disclaimer in small print.

A promille calculator models an average body with an average liver, and then applies that model to you. Real blood alcohol depends on things the arithmetic cannot see: how much and what you ate, whether the drinks were spread over six hours or three, your medication, your liver health, your hydration, and your own metabolic rate. Two people of identical weight and gender, drinking identically, can land meaningfully far apart.

What you *can* rely on is the direction of the error. Relimie's estimator is built so that every uncertain choice pushes the same way, toward a higher reading and a longer wait:

- **No absorption deduction.** Between 10% and 30% of the alcohol you drink is broken down before it ever reaches your bloodstream. The raw Widmark formula ignores that, and so do we. Applying the usual correction would shorten the displayed wait by up to a fifth, exactly in the borderline cases where someone is most likely to act on the number.
- **The whole day counted at once.** Everything you logged is treated as if it hit your blood simultaneously, which produces a higher peak than drinks actually spread across an evening.
- **Durations rounded up.** Every time until clear is rounded up to the next five minutes, never down.
- **No guessed body weight.** Until you enter your weight, the app shows nothing at all rather than assuming a default. An assumed 75 kg would show a *lower* value and a *shorter* wait to anyone lighter than that, which is the one direction this must never err in.

One honest exception: the 0.15 ‰ per hour elimination rate is a mid-range figure, not a cautious one. Real rates run from roughly 0.1 to 0.2 ‰ per hour. If yours is at the slow end, your actual wait is longer than anything shown here, by up to half again.

Which gives a usable verdict: this number is good enough to plan a morning around, and to see that three beers is a longer commitment than it feels like. **It is never good enough to decide whether you can drive, work, operate anything, or take medication.** No calculator is, including this one, and including every app on your phone. If there is any doubt at all, the answer is don't.

## Where Relimie fits in

The weak link in every promille calculator is the input. You have to remember what you drank and how large the pours were, and by the next morning that recall is already unreliable, which is why the estimate is often wrong long before the formula gets involved.

Relimie closes that gap by working from what you logged as you went. You record drinks in the moment, the app converts each one to grams of pure alcohol, and on any day with something logged you can open the estimate directly from your home screen. It shows the level, how it falls hour by hour, and how long until it is fully cleared, from real entries rather than a reconstruction.

> 🎁 **Free, and staying free:** The blood alcohol estimate is part of the free version of Relimie. It is not behind Premium, it never expires with your trial, and it works on any day you logged a drink, including past days. Everything stays on your device, with no account and no cloud.

Over time the same entries feed your [Analytics](index.html#ls-analytics), so the morning-after question turns into something more useful: not just how long until today clears, but what your drinking actually looks like across a month.

## Frequently asked questions

**How much promille do I have after two beers?**
For two 500 ml beers at 5%, that is 40 grams of alcohol. An 80 kg man comes to 40 / (80 × 0.7) = about 0.71 ‰; a 60 kg woman to 40 / (60 × 0.6) = about 1.11 ‰. The same two beers, a difference of more than half a per mille, which is why body weight and gender are not optional inputs.

**How long does it take to clear one per mille?**
At the usual rate of about 0.15 ‰ per hour, roughly six hours and forty minutes. Alcohol leaves at a near constant rate rather than tailing off, so the arithmetic is simply your level divided by 0.15.

**How long does alcohol stay in your system after a long evening?**
Longer than it feels. After 100 grams, roughly five half-litre beers, an 80 kg man is at about 1.79 ‰ and needs close to twelve hours to reach zero. Someone who stopped at two in the morning still has alcohol in their blood at midday, however awake they feel by then.

**Can I speed up sobering up?**
No. Coffee, cold showers, water, food, fresh air and sleep can all make you feel more alert, but none of them change how fast your liver processes alcohol. Only time lowers the level.

**How accurate is a promille calculator?**
Treat it as a range, not a reading. It cannot account for what you ate, how the drinks were spaced, your medication, your liver or your individual metabolism, and real values vary considerably between people who drank exactly the same amount. Relimie's version deliberately rounds toward a higher reading and a longer wait, because that is the only direction that cannot hurt someone acting on it.

**Can I use this to decide whether to drive?**
No, and please don't. This is an estimate produced by arithmetic, not a measurement from a breathalyser or a blood test, and your real level can be considerably higher than what is shown. It is a recovery clock, never a green light. If you are in any doubt, don't drive.

**Does the estimate cost anything in Relimie?**
No. It is part of the free version, it does not expire with your trial, and it is available on every day where you logged at least one drink.

---

Want the estimate to work from what you actually drank rather than what you remember? [Start logging in Relimie](index.html#ls-logging), read the [User Guide](guide.html) to get set up in a minute, or browse more [mindful drinking articles](articles.html).
