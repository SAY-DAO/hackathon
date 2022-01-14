import React from "react";

export default function Main() {
  const needs = [
    {
      id: 7170,
      imageUrl:
        "https://api.sayapp.company/files/3-child/needs/7170-need/39255e94b04e47e6b1154fb93898b1e0.png",
      name: "Accessories",
      cost: 190000,
      isDone: true,
      type: 1,
      created: "Wed, 01 Dec 2021 11:06:48 GMT",
      doneAt: "Sat, 25 Dec 2021 04:45:36 GMT",
      child: {
        id: 3,
        sayName: "Mahmood",
        avatarUrl:
          "https://api.sayapp.company/files/3-child/3-sleptAvatar_0010010003.png",
      },
    },
  ];
  return (
    <div>
      <header className="App-header">
        <p>A Random Need Object</p>
      </header>
      <pre>{JSON.stringify(needs, 0, 2)}</pre>
    </div>
  );
}
