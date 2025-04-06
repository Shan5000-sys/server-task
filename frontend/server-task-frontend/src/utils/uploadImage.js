"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const uploadImage = async (uploadUrl, file) => {
    try {
        const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });
        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }
    }
    catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
exports.uploadImage = uploadImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkSW1hZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1cGxvYWRJbWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBTyxNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQUUsU0FBaUIsRUFBRSxJQUFVLEVBQUUsRUFBRTtJQUMvRCxJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQ3RDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBRSxJQUFJLENBQUMsSUFBSTthQUMxQjtZQUNELElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDbEU7S0FDRjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvQyxNQUFNLEtBQUssQ0FBQztLQUNiO0FBQ0gsQ0FBQyxDQUFDO0FBakJTLFFBQUEsV0FBVyxlQWlCcEIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgdXBsb2FkSW1hZ2UgPSBhc3luYyAodXBsb2FkVXJsOiBzdHJpbmcsIGZpbGU6IEZpbGUpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cGxvYWRVcmwsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogZmlsZS50eXBlLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBmaWxlLFxuICAgICAgfSk7XG4gIFxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVwbG9hZCBmYWlsZWQgd2l0aCBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgdXBsb2FkaW5nIGltYWdlOlwiLCBlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH07Il19