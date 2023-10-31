import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shared/index";

const meta: Meta<typeof Card> = {
  title: "Shared/UI/Card",
  component: Card,
};

export default meta;

export const Default: StoryObj<typeof Card> = {
  render: () => {
    return <Card data-testid="card">Content</Card>;
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const card = ctx.getByTestId("card");
    await expect(card).toBeVisible();
  },
};

export const Rich: StoryObj<typeof Card> = {
  render: () => {
    return (
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const card = ctx.getByTestId("card");
    await expect(card).toBeVisible();
  },
};
