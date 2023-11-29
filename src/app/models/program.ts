export interface Program {
  name: string;
  id: number;
  description: string;
  programimage: string;
  programimagetemplate: string;
  fav: boolean;
  programcategory: {
    id: number;
  };
}
