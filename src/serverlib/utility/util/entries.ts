import {
  AssetEntry,
  ContentCalculatedFields,
} from "@lakshmanedupuganti/server-library";
import { ButtonEntry, ButtonFields, MixedContentEntry } from "@src/lib/types";
import crypto from "crypto";

class Utility {
  public createAssetEntryWithImgUrl(imgUrl: string): AssetEntry | null {
    if (!imgUrl) {
      return null;
    }
    const fileName = imgUrl.split("/").pop() || "";
    return {
      id: this.generateRandomId(18),
      contentType: "Asset",
      fields: {
        title: fileName || "",
        description: fileName,
        file: {
          url: imgUrl,
          details: { size: 200, image: { width: 200, height: 200 } },
          fileName: fileName,
          contentType: "image/jpeg",
        },
      },
    };
  }

  public createContentEntry(
    contentType: string,
    field: any,
    calculated: ContentCalculatedFields,
  ): MixedContentEntry {
    return {
      id: calculated.clientId,
      contentType: contentType,
      fields: field,
      calculated: {
        ...calculated,
      },
    };
  }

  public createContainerHeadingCardsCtaEntry(
    template: string,
    contents: MixedContentEntry[],
    calculated: ContentCalculatedFields,
  ): MixedContentEntry[] {
    return [
      {
        id: calculated.clientId,
        contentType: "containerHeadingCardsCta",
        fields: { template, contents },
        calculated: {
          ...calculated,
        },
      },
    ];
  }

  public createButtonEntry(props: ButtonFields): ButtonEntry {
    const {
      variant = "primary",
      color = "heritage-blue",
      label,
      calculatedUrl,
      align = "left",
      ...rest
    } = props;
    return {
      id: this.generateRandomId(20),
      contentType: "button",
      fields: {
        variant,
        color,
        label,
        calculatedUrl,
        align,
        ...rest,
      },
    };
  }

  public generateRandomId(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    const randomBytes = crypto.randomBytes(length); // Generate secure random bytes

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytes[i] % charactersLength; // Map byte to a character index
      result += characters.charAt(randomIndex); // Add the corresponding character to the result
    }
    return result;
  }
}

const inst = new Utility();
export default inst;
