import { useState } from "react";
import Image from "next/image";

const DetailedView = ( ) => {

    return(
        <div className={`flex min-h-screen flex-col items-center justify-between p-24`}>
            <a
              className="relative block p-8 overflow-hidden border bg-white border-slate-100 rounded-lg ml-6 mr-6"
              href=""
            >
              <span
                className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"
              ></span>
                <div className="flex items-center justify-center mb-5">
                  <Image
                    className="object-cover rounded-lg shadow-sm"
                    src="/obt.jpeg"
                    alt=""
                    width={800}
                    height={800}
                  />
                </div>
              <div className="justify-between sm:flex">

                <div>
                  <h5 className="text-xl font-bold text-slate-900">
                    Building a beautiful product as a software developer
                  </h5>
                  <p className="mt-1 text-xs font-medium text-slate-600">By Ana Doe</p>
                </div>

                <div className="flex-shrink-0 hidden ml-3 sm:block">
                </div>
              </div>

              <div className="mt-4 sm:pr-8">
                <p className="text-sm text-slate-500">
                  Open source Tailwind UI components and templates to
            bootstrap your new apps, projects or landing sites! Open source Tailwind UI.
                </p>
              </div>

              <dl className="flex mt-6">
                <div className="flex flex-col-reverse">
                  <dt className="text-sm font-medium text-slate-600">Published</dt>
                  <dd className="text-xs text-slate-500">31st June, 2022</dd>
                </div>

                <div className="flex flex-col-reverse ml-3 sm:ml-6">
                  <dt className="text-sm font-medium text-slate-600">Reading time</dt>
                  <dd className="text-xs text-slate-500">5 minutes</dd>
                </div>
              </dl>
            </a>
                    </div>
    )

    
}

export default DetailedView