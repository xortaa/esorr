/* prettier-ignore */
"use client"
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className={styles.main}>
      {session ? (
        <div>
          <h1>{`hello ${session.user.email}`}</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold underline">go log in</h1>
          <Link href="/auth/signin">
            <button className="btn btn-primary">go to signup page</button>
          </Link>
        </div>
      )}
    </main>
  );
}
