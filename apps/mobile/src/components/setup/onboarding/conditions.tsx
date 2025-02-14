import { useState } from "react";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { zodResolver } from "@hookform/resolvers/zod";
import { eq } from "drizzle-orm";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { useDB } from "~/db";
import { userProfile } from "~/db/schema";

const conditionsSchema = z.object({
  conditions: z.string(),
});

type ConditionsSchema = z.infer<typeof conditionsSchema>;

interface OnboardingProps {
  onComplete: () => void;
}

export default function OnboardingConditions({ onComplete }: OnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const db = useDB();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(conditionsSchema),
    defaultValues: {
      conditions: "",
    },
  });

  const onSubmit = async (data: ConditionsSchema) => {
    setIsLoading(true);
    await db
      .update(userProfile)
      .set({
        conditions: data.conditions,
      })
      .where(eq(userProfile.id, 1));
    setIsLoading(false);
    onComplete();
  };

  return (
    <View className="flex w-full flex-col items-center justify-center gap-4">
      <Animated.View
        entering={FadeIn.duration(300).delay(500)}
        className="w-full"
      >
        <Text className="text-balance text-center font-semibold italic text-primary">
          Have any medical conditions or things you suspect?
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeIn.duration(300).delay(900)}
        className="w-full"
      >
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Textarea
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className="w-full"
              placeholder="I think I have a food allergy to gluten."
              numberOfLines={3}
            />
          )}
          name="conditions"
        />
        {errors.conditions && <Text>{errors.conditions.message}</Text>}
      </Animated.View>
      <Animated.View
        entering={FadeIn.duration(300).delay(1300)}
        className="w-full"
      >
        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          className="w-full"
        >
          <Text>Share your Conditions</Text>
        </Button>
      </Animated.View>
    </View>
  );
}
