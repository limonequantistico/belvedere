import { useAuth } from "@/context/supabase-provider";
import "@/lib/googleSignIn";
import { Redirect } from "expo-router";

export default function Index() {
    const { session } = useAuth();

    return session ? <Redirect href="/(protected)/(tabs)" /> : <Redirect href="/welcome" />;
}
