import Link from "next/link";
import Header from "@/components/Header";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    const userCourses = await db.select()
        .from(courses)
        .where(eq(courses.userEmail, userEmail || ""))
        .orderBy(desc(courses.createdAt));

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="p-10 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-bold text-3xl">My Courses</h2>
                    <Link href={"/create-course"}>
                        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm">
                            + Create Course
                        </button>
                    </Link>
                </div>

                {userCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 text-center">
                        <p className="text-lg text-slate-500 mb-5">You haven't generated any courses yet.</p>
                        <Link href={"/create-course"}>
                            <button className="bg-primary text-white px-6 py-3 rounded-lg">Get Started</button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userCourses.map((course) => (
                            <Link href={`/course/${course.courseId}`} key={course.id} className="block">
                                <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition cursor-pointer h-full flex flex-col">
                                    {/* <img src={course.courseBanner} alt="course" className="w-full h-40 object-cover rounded-lg mb-4 bg-slate-200"/> */}
                                    <div className="h-40 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center text-white text-4xl font-bold">
                                        {course.name[0]}
                                    </div>
                                    <h3 className="font-bold text-lg line-clamp-2 mb-2">{course.name}</h3>
                                    <div className="flex justify-between items-center mt-auto text-sm text-slate-500">
                                        <div className="flex gap-2 items-center">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{course.level}</span>
                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">{course.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
