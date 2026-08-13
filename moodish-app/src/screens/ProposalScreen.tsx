import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import GlassCard from "../components/GlassCard";
import PillSelect from "../components/PillSelect";
import TextField from "../components/TextField";
import SliderField from "../components/SliderField";
import Button from "../components/Button";
import RestaurantCard from "../components/RestaurantCard";
import { colors } from "../theme/theme";
import {
  GENRE_OPTIONS,
  LOCATION_MODE_OPTIONS,
  PURPOSE_OPTIONS,
  SCENE_OPTIONS,
  SEAT_OPTIONS,
  SMOKING_OPTIONS,
} from "../data/options";
import { DUMMY_RESTAURANTS, pickRandomRestaurants } from "../data/restaurants";
import { formatDate, formatYen, moodTextFromValues } from "../utils/format";
import { saveSubmission } from "../utils/storage";
import type { LocationMode, ProposalFormState, ProposalSubmission, Restaurant } from "../types";

const initialState: ProposalFormState = {
  purpose: "",
  locationMode: "area",
  area: "",
  station1: "",
  station2: "",
  budgetMin: 3000,
  budgetMax: 8000,
  scene: "",
  datetime: "",
  genre: "",
  seat: "おまかせ",
  moodCasualSpecial: 2,
  moodBrightDark: 2,
  moodLivelyQuiet: 2,
  ngFood: "",
  allergy: "",
  smoking: "こだわらない",
};

export default function ProposalScreen() {
  const [form, setForm] = useState<ProposalFormState>(initialState);
  const [showPicker, setShowPicker] = useState(false);
  const [results, setResults] = useState<Restaurant[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const update = <K extends keyof ProposalFormState>(key: K, value: ProposalFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onBudgetMinChange = (v: number) => {
    setForm((prev) => ({ ...prev, budgetMin: v > prev.budgetMax ? prev.budgetMax : v }));
  };

  const onBudgetMaxChange = (v: number) => {
    setForm((prev) => ({ ...prev, budgetMax: v < prev.budgetMin ? prev.budgetMin : v }));
  };

  const handleSubmit = async () => {
    if (!form.purpose || !form.scene || !form.genre || !form.datetime) {
      setErrorMsg("必須項目(目的・関係性 / シーン / 日時 / 店のジャンル)を入力してください。");
      return;
    }
    if (form.locationMode === "area" && !form.area) {
      setErrorMsg("エリアを入力してください。");
      return;
    }
    if (form.locationMode === "midpoint" && (!form.station1 || !form.station2)) {
      setErrorMsg("2人の最寄駅を入力してください。");
      return;
    }
    setErrorMsg("");

    const locationText =
      form.locationMode === "area"
        ? form.area
        : `${form.station1} 〜 ${form.station2} の中間`;

    const submission: ProposalSubmission = {
      id: `${Date.now()}`,
      submittedAt: new Date().toISOString(),
      purpose: form.purpose,
      locationMode: form.locationMode,
      locationText,
      area: form.area,
      station1: form.station1,
      station2: form.station2,
      budgetMin: form.budgetMin,
      budgetMax: form.budgetMax,
      budget: `${formatYen(form.budgetMin)}〜${formatYen(form.budgetMax)}`,
      scene: form.scene,
      datetime: form.datetime,
      genre: form.genre,
      seat: form.seat,
      moodCasualSpecial: form.moodCasualSpecial,
      moodBrightDark: form.moodBrightDark,
      moodLivelyQuiet: form.moodLivelyQuiet,
      moodText: moodTextFromValues(form.moodCasualSpecial, form.moodBrightDark, form.moodLivelyQuiet),
      ngFood: form.ngFood,
      allergy: form.allergy,
      smoking: form.smoking,
    };

    await saveSubmission(submission);
    setResults(pickRandomRestaurants(DUMMY_RESTAURANTS, 3));
  };

  const selectedDate = form.datetime ? new Date(form.datetime) : new Date();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.title}>今日のデート、どんなお店にする?</Text>
        <Text style={styles.introText}>
          いくつか質問に答えるだけで、シーンに合ったお店を3つ提案します。{"\n"}
          (このページはプロトタイプです。提案結果は仮のダミーデータです)
        </Text>
      </View>

      <GlassCard style={styles.card}>
        <Text style={styles.blockTitle}>必須項目</Text>

        <PillSelect
          label="目的・関係性"
          required
          options={PURPOSE_OPTIONS}
          value={form.purpose}
          onChange={(v) => update("purpose", v)}
        />

        <View style={styles.field}>
          <Text style={styles.label}>
            場所<Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.row}>
            {LOCATION_MODE_OPTIONS.map((opt) => {
              const selected = form.locationMode === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => update("locationMode", opt.value as LocationMode)}
                  style={[styles.pill, selected && styles.pillSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {form.locationMode === "area" ? (
            <TextField
              label=""
              placeholder="例:恵比寿、渋谷駅周辺 など"
              value={form.area}
              onChangeText={(t) => update("area", t)}
              style={styles.noLabelInput}
            />
          ) : (
            <View style={styles.twoCol}>
              <TextField
                label=""
                placeholder="自分の最寄駅"
                value={form.station1}
                onChangeText={(t) => update("station1", t)}
                style={styles.halfInput}
              />
              <TextField
                label=""
                placeholder="相手の最寄駅"
                value={form.station2}
                onChangeText={(t) => update("station2", t)}
                style={styles.halfInput}
              />
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            予算 / 1人<Text style={styles.required}> *</Text>
          </Text>
          <Text style={styles.budgetRange}>
            {formatYen(form.budgetMin)} 〜 {formatYen(form.budgetMax)}
          </Text>
          <SliderField
            label="下限"
            value={form.budgetMin}
            minimumValue={1000}
            maximumValue={20000}
            step={500}
            onValueChange={onBudgetMinChange}
            valueLabel={formatYen(form.budgetMin)}
          />
          <SliderField
            label="上限"
            value={form.budgetMax}
            minimumValue={1000}
            maximumValue={20000}
            step={500}
            onValueChange={onBudgetMaxChange}
            valueLabel={formatYen(form.budgetMax)}
          />
        </View>

        <PillSelect
          label="ランチ・ディナー・カフェ"
          required
          options={SCENE_OPTIONS}
          value={form.scene}
          onChange={(v) => update("scene", v)}
        />

        <View style={styles.field}>
          <Text style={styles.label}>
            日時<Text style={styles.required}> *</Text>
          </Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateButtonText}>
              {form.datetime ? formatDate(form.datetime) : "日時を選択してください"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode={Platform.OS === "ios" ? "datetime" : "date"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_event, date) => {
                if (Platform.OS !== "ios") setShowPicker(false);
                if (date) update("datetime", date.toISOString());
              }}
            />
          )}
        </View>

        <PillSelect
          label="店のジャンル"
          required
          options={GENRE_OPTIONS}
          value={form.genre}
          onChange={(v) => update("genre", v)}
        />
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.blockTitle}>任意項目</Text>

        <PillSelect
          label="席"
          options={SEAT_OPTIONS}
          value={form.seat}
          onChange={(v) => update("seat", v)}
        />

        <View style={styles.field}>
          <Text style={styles.label}>雰囲気</Text>
          <SliderField
            label="カジュアル ← → 特別感"
            value={form.moodCasualSpecial}
            minimumValue={0}
            maximumValue={4}
            step={1}
            onValueChange={(v) => update("moodCasualSpecial", v)}
            valueLabel={String(form.moodCasualSpecial)}
          />
          <SliderField
            label="明るい ← → 暗め"
            value={form.moodBrightDark}
            minimumValue={0}
            maximumValue={4}
            step={1}
            onValueChange={(v) => update("moodBrightDark", v)}
            valueLabel={String(form.moodBrightDark)}
          />
          <SliderField
            label="にぎやか ← → 静か"
            value={form.moodLivelyQuiet}
            minimumValue={0}
            maximumValue={4}
            step={1}
            onValueChange={(v) => update("moodLivelyQuiet", v)}
            valueLabel={String(form.moodLivelyQuiet)}
          />
        </View>

        <TextField
          label="苦手な料理"
          placeholder="例:パクチー、生もの など"
          value={form.ngFood}
          onChangeText={(t) => update("ngFood", t)}
        />
        <TextField
          label="アレルギー"
          placeholder="例:卵、甲殻類 など"
          value={form.allergy}
          onChangeText={(t) => update("allergy", t)}
        />
        <PillSelect
          label="喫煙可否"
          options={SMOKING_OPTIONS}
          value={form.smoking}
          onChange={(v) => update("smoking", v)}
        />
      </GlassCard>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Button title="お店を提案してもらう" onPress={handleSubmit} style={styles.submitBtn} />

      {results && (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>あなたにおすすめのお店 3選</Text>
          <Text style={styles.resultNote}>
            ※ プロトタイプのため、実際の絞り込みは行わずダミーデータから3件を表示しています。
          </Text>
          {results.map((r) => (
            <RestaurantCard key={r.name} restaurant={r} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 48,
  },
  intro: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  introText: {
    fontSize: 13,
    color: colors.textSub,
    lineHeight: 20,
  },
  card: {
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryDarker,
    marginBottom: 14,
    letterSpacing: 1,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.danger,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  pillText: {
    fontSize: 13,
    color: colors.textSub,
  },
  pillTextSelected: {
    color: colors.white,
    fontWeight: "700",
  },
  noLabelInput: {
    marginTop: 2,
  },
  twoCol: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  budgetRange: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primaryDarker,
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dateButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },
  submitBtn: {
    marginTop: 4,
  },
  resultSection: {
    marginTop: 28,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  resultNote: {
    fontSize: 12,
    color: colors.textSub,
    marginBottom: 14,
  },
});
