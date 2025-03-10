
const Loading = () => {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
         <img alt="Loading spinner icon with a circular design" className="mx-auto mb-4" height="100" src="/loading-animation.gif" width="100"/>
         <h1 className="text-2xl font-semibold text-gray-700">
          Loading...
         </h1>
         <p className="text-gray-500">
          Please wait while we load the content for you.
         </p>
        </div>
       </main>
    )
}

export default Loading;