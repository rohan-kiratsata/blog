import React from "react";

export default function freelance() {
  return (
    <>
      <h2 className="font-medium text-white mt-10">freelance</h2>
      <div className="mt-3 px-2">
        <p>
          <span className="font-medium text-white">
            Employees Internal Portal
          </span>{" "}
        </p>
        <p className="">
          built an internal portal for a company where employees can check
          updates about the companies like new joinees, news and annoucements
          feed, tasks, etc. <br />
          Tech : NextJS as frontend framework, shadcn/ui and tailwindcss for
          styling. The employees and user tasks are fetched from{" "}
          <span className="font-medium text-white">Microsoft Graph API</span>.
          All the other content like news, annoucements, etc are fetched from{" "}
          <span className="font-medium text-white">Payload CMS</span>.
          Authentication is handled by{" "}
          <span className="font-medium text-white">Stack Auth</span>.
        </p>
      </div>
      <div className="mt-3 px-2">
        <p>
          <span className="font-medium text-white">HRMS</span>{" "}
        </p>
        <p className="">
          built an HR Management System for a company.
          <br />
          Tech: Custom authentication, migration from pages router to app
          router, react query for data fetching, migrated from material-tailwind
          to Radix UI for design system
        </p>
      </div>
    </>
  );
}
