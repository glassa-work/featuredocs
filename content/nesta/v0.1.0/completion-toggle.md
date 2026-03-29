# Completion Toggle — Check Off Your Day

One of the simplest but most satisfying features in Nesta. Tap any item to mark it as completed. It fades gently, letting you focus on what is left.

::video[videos/demo_completion_toggle.mp4]

## How It Works

Every event and task in the day view has a completion toggle. When you tap an item:

1. A subtle checkmark animation plays
2. The item fades to 40% opacity
3. It moves to the bottom of its category group
4. A small "undo" toast appears for 5 seconds

## Shared Completion

When you mark something as done, every family member sees the update instantly. This is especially useful for shared tasks like:

- Packing school lunches
- Walking the dog
- Taking out the trash

## Design Decisions

We chose to fade rather than hide completed items. Hiding creates anxiety — did I actually do that? Fading provides confidence while keeping the timeline complete.

::video[videos/demo_completion_toggle.mp4]{title="Undo a Completion"}

The undo gesture was important to get right. We tested swipe-to-undo, shake-to-undo, and a simple toast. The toast won because it requires no explanation and works the same on every device.
