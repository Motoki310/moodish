import React, { useCallback, useState } from "react";
import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import { colors, radius } from "../theme/theme";
import { clearSubmissions, getSubmissions } from "../utils/storage";
import { formatDate } from "../utils/format";
import type { ProposalSubmission } from "../types";

// 元: Moodish/js/admin.js の ADMIN_PASSWORD を移植(プロトタイプ用の簡易ゲート)
const ADMIN_PASSWORD = "eY3$Tf@FJLjkj^UwOQVr";

export default function AdminScreen() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [submissions, setSubmissions] = useState<ProposalSubmission[]>([]);

  const loadSubmissions = useCallback(async () => {
    const list = await getSubmissions();
    setSubmissions(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (loggedIn) loadSubmissions();
    }, [loggedIn, loadSubmissions])
  );

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setLoginError(false);
      setLoggedIn(true);
      loadSubmissions();
    } else {
      setLoginError(true);
      setPassword("");
    }
  };

  const handleExport = async () => {
    if (submissions.length === 0) return;
    try {
      await Share.share({
        message: JSON.stringify(submissions, null, 2),
        title: `date-spot-submissions_${Date.now()}.json`,
      });
    } catch {
      // ユーザーがキャンセルした場合などは何もしない
    }
  };

  const handleClear = () => {
    if (submissions.length === 0) return;
    Alert.alert(
      "全データを削除",
      `保存されている${submissions.length}件の送信データをすべて削除します。よろしいですか?この操作は取り消せません。`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: async () => {
            await clearSubmissions();
            setSubmissions([]);
          },
        },
      ]
    );
  };

  if (!loggedIn) {
    return (
      <View style={styles.loginContainer}>
        <GlassCard style={styles.loginCard}>
          <Text style={styles.loginTitle}>管理者用:入力データ一覧</Text>
          <Text style={styles.loginDesc}>
            ユーザーがフォームから送信した内容を、この端末内に保存して一覧表示しています。
          </Text>
          <Text style={styles.label}>管理者パスワード</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {loginError && <Text style={styles.errorText}>パスワードが違います。</Text>}
          <Button title="ログイン" onPress={handleLogin} style={styles.loginBtn} />
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.entryCount}>{submissions.length}件の送信データ</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleExport}>
            <Text style={styles.secondaryBtnText}>JSONで書き出し</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleClear}>
            <Text style={styles.dangerBtnText}>全データを削除</Text>
          </TouchableOpacity>
        </View>
      </View>

      {submissions.length === 0 ? (
        <Text style={styles.emptyState}>
          まだ送信データがありません。提案フォームから送信すると、ここに表示されます。
        </Text>
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const ngSummary =
              [
                item.ngFood ? `苦手:${item.ngFood}` : "",
                item.allergy ? `アレルギー:${item.allergy}` : "",
                item.smoking && item.smoking !== "こだわらない" ? `喫煙:${item.smoking}` : "",
              ]
                .filter(Boolean)
                .join(" / ") || "-";

            return (
              <GlassCard style={styles.entryCard} radiusSize="md">
                <Text style={styles.entryDate}>{formatDate(item.submittedAt)}</Text>
                <Text style={styles.entryRow}>目的・関係性: {item.purpose}</Text>
                <Text style={styles.entryRow}>場所: {item.locationText}</Text>
                <Text style={styles.entryRow}>予算/1人: {item.budget}</Text>
                <Text style={styles.entryRow}>シーン: {item.scene}</Text>
                <Text style={styles.entryRow}>希望日時: {formatDate(item.datetime)}</Text>
                <Text style={styles.entryRow}>ジャンル: {item.genre}</Text>
                <Text style={styles.entryRow}>席: {item.seat}</Text>
                <Text style={styles.entryRow}>雰囲気: {item.moodText}</Text>
                <Text style={styles.entryRow}>NG: {ngSummary}</Text>
              </GlassCard>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  loginCard: {},
  loginTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  loginDesc: {
    fontSize: 13,
    color: colors.textSub,
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: 8,
  },
  loginBtn: {
    marginTop: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  toolbar: {
    marginBottom: 12,
  },
  entryCount: {
    fontSize: 13,
    color: colors.textSub,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },
  dangerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.danger,
  },
  dangerBtnText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: "600",
  },
  emptyState: {
    fontSize: 13,
    color: colors.textSub,
    textAlign: "center",
    marginTop: 40,
  },
  list: {
    paddingBottom: 32,
  },
  entryCard: {
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 12,
    color: colors.textSub,
    marginBottom: 6,
  },
  entryRow: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 2,
  },
});
